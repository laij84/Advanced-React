import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NProgress from 'nprogress';
import Router from 'next/router';
import PropTypes from 'prop-types';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

export default class TakeMyMoney extends Component {
    totalItems = (cart) => {
        return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
    };

    onToken = async (res, createOrder) => {
        NProgress.start();
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => {
            alert(err.message);
            NProgress.done();
        });
        Router.push({
            pathname: '/order',
            query: { id: order.data.createOrder.id }
        });
    };

    render() {
        return (
            <User>
                {({data: { me }}) => (
                    <Mutation 
                        mutation={CREATE_ORDER_MUTATION}
                        refetchQueries={[{query: CURRENT_USER_QUERY}]}
                    >
                        {(createOrder) => (
                            <StripeCheckout
                                amount={calcTotalPrice(me.cart)}
                                currency="GBP"
                                name="Sick Fits"
                                description={`Order of ${this.totalItems(me.cart)} items`}
                                image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                                stripeKey="pk_test_q1qshpWMHECwYC4yd95hHCa1"
                                email={me.email}
                                token={ res => this.onToken(res, createOrder)}
                            >
                                {this.props.children}
                            </StripeCheckout>
                        )}
                    </Mutation>
                )}
            </User>
        )
    }
}
