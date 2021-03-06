import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`

const BigButton = styled.button`
    font-size: 3rem;
    background-color: none;
    border: 0;
    &:hover {
        color: ${props => props.theme.red}
        cursor: pointer;
    }
`

export default class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    // gets called when response from server after mutation
    update = (cache, payload) => {
        // read cache
        const data = cache.readQuery({query: CURRENT_USER_QUERY});
        console.log(data);

        // remove from cache
        const cartItemId = payload.data.removeFromCart.id
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

        // write cache
        cache.writeQuery({ query: CURRENT_USER_QUERY, data })
    };

    render() {
        return (
            <Mutation 
                mutation={REMOVE_FROM_CART_MUTATION} 
                variables={{id: this.props.id}}
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }}
            >
            {(removeFromCart, {error, loading})=>(
                <BigButton 
                    title="Delete item"
                    disabled={loading}
                    onClick={() => {
                        removeFromCart().catch( err => alert(err.message));
                    }}
                >
                    &times;
                </BigButton>
            )}
            </Mutation>
            
        )
    }
}
