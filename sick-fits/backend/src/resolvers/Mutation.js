const Mutations = {
    async createItem(parent, args, context, info) {
        // TODO check if user logged in

        const item = await context.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);
        console.log(item);
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
        const item = await context.db.query.item({where}, `{ id title }`);
        //Check if they own item and have permissions
        //delete item
        return context.db.mutation.deleteItem({where}, info)
    }
};

module.exports = Mutations;
