const { forwardTo } = require('prisma-binding');

const Query = {
    // Use the prisma query for all items
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),

    // async items(parent, args, context, info) {
    //     const items = await context.db.query.items()
    //     return items
    // }
};

module.exports = Query;
