const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    // Use the prisma query for all items
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, context, info) {
        //check if current user id
        if(!context.request.userId) {
            return null;
        }
        return context.db.query.user({
            where: { id: context.request.userId}
        }, info)
    },
    async users(parent, args, context, info) {
        // check if user logged in
        if(!context.request.userId) {
            throw new Error('You must be logged in!');
        }

        // check if user has permission to query all users
        hasPermission(context.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        // if true, query all users
        return context.db.query.users({}, info);
    }
};

module.exports = Query;
