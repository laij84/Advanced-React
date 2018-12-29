const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
// converts callback based functions into promise based functions
const { promisify } = require('util');
const {transport, makeANiceEmail } = require('../mail.js');
const { hasPermission } = require('../utils');

const Mutations = {
    async createItem(parent, args, context, info) {
        // TODO check if user logged in
        if(!context.request.userId) {
            throw new Error("You must be logged in to do that!");
        }

        const item = await context.db.mutation.createItem({
            data: {
                // create relationship between item and user
                user: {
                    connect: {
                        id: context.request.userId,
                    }
                },
                ...args,
            }
        }, info);
        return item;
    },

    updateItem(parent, args, context, info) {
        // take copy of the updates
        const updates = {...args};

        //remove ID from updates
        delete updates.id;

        return context.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id
                },
            },
            info
        );
    },

    async deleteItem(parent, args, context, info) {
        const where = {id: args.id};
        
        //find item
        const item = await context.db.query.item({where}, `{ 
            id 
            title 
            user { id }
        }`);
        
        //Check if they own item and have permissions
        const ownsItem = item.user.id === context.request.userId;
        const hasPermissions = context.request.user.permissions.some( permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

        if(!ownsItem && hasPermissions) {
            throw new Error("You don't have permission to delete");  
        } 

        //delete item
        return context.db.mutation.deleteItem({where}, info)
    },

    async signup(parent, args, context, info) {
        args.email = args.email.toLowerCase();
        // Hash PW
        const password = await bcrypt.hash(args.password, 10);

        // create user in db
        const user = await context.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {set: ['USER']}
            }
        }, info);

        // create json web token to signin
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);

        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        });

        // Return user to browser
        return user;
    },

    async signin(parent, {email, password}, context, info) {
        //Check if user with email in db
        const user = await context.db.query.user({where: { email }});

        if(!user) {
            throw new Error(`No such user found for email ${email}`);
        }

        //check password
        const valid = await bcrypt.compare(password, user.password);

        if(!valid) {
            throw new Error('Invalid password');
        }
        // generate token
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        // set cookie
        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        });
        // return user
        return user
    },

    signout(parent, args, context, info) {
        context.response.clearCookie('token');
        return {message: 'Goodbye!'};
    },

    async requestReset(parent, args, context, info) {
        // check if user exists
        const user = await context.db.query.user({where: {email: args.email}});

        if(!user) {
            throw new Error(`no such user found for ${args.email}`);
        }

        // set reset token and expiry
        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour
        const res = await context.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry }
        });

        // email reset token
        const mailRes = await transport.sendMail({
            from: 'sickfits@sickfits.com',
            to: user.email,
            subject: "Your password reset token",
            html: makeANiceEmail(`Your password reset token is here \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
        });

        return { message: 'Thanks!'};
        
    },

    async resetPassword(parent, args, context, info) {
        // check if passwords match
        if(args.password !== args.confirmPassword) {
            throw new Error("You're passwords don't match");
        }

        // verify token and check if its expired
        const [user] = await context.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            }
        });

        if (!user) {
            throw new Error('This token is either invalid or expired');
        }

        // hash new password
        const password = await bcrypt.hash(args.password, 10);
        // save new password and remove reset token

        const updatedUser = await context.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null,
            }
        })
        // generate jwt
        const token = jwt.sign({ userId: updatedUser.id}, process.env.APP_SECRET);
        
        // set jwt cookie
        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        })
        // return new user
        return updatedUser;
    },

    async updatePermissions(parent, args, context, info) {
        // check logged in
        if(!context.request.userId) {
            throw new Error('Your must be logged in!');
        }
        // get current user
        const currentUser = await context.db.query.user({ where: { id: context.request.userId }}, info);

        // check permissions
        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

        // update permission
        return context.db.mutation.updateUser({
            data: { permissions: {
                set: args.permissions
            }},
            where: {
                id: args.userId
            }
        }, info);
    }
};

module.exports = Mutations;
