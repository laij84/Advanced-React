const Mutations = {
    // createDog(parent, args, context, info){
    //     global.dogs = global.dogs || [];
    //     //create a dog
    //     const newDog = {name: args.name};
    //     global.dogs.push(newDog);
    //     return newDog;
    // }

    async createItem(parent, args, context, info) {
        // TODO check if user logged in

        const item = await context.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);
        console.log(item);
        return item;
    }
};

module.exports = Mutations;
