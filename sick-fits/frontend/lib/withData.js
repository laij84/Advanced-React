import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
    return new ApolloClient({
        uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
        request: operation => {
            operation.setContext({
                fetchOptions: {
                  credentials: 'include',
                },
                headers,
            });
        },
        // Local Data
        clientState: {
            resolvers: {
                Mutation: {
                    toggleCart(_, variables, { cache }) {
                        //read cartOpen from cache
                        const { cartOpen } = cache.readQuery({
                            query: LOCAL_STATE_QUERY
                        });
                        console.log(cartOpen);
                        
                        // Set cart open to opposite and write to cache
                        const data = {
                            data: {cartOpen: !cartOpen}
                        };
                        cache.writeData(data);
                        return data;
                    }
                }
            },
            defaults: {
                cartOpen: false,
            }
        }
    });
}

export default withApollo(createClient);
