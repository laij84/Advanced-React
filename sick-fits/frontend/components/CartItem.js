import React, { Component } from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import RemoveFromCart from './RemoveFromCart';

const StyledCartItem = styled.li`
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;

    img {
        margin-right: 10px;
    }

    h3 {
        margin: 0;
    }
`;

const CartItem = ({ cartItem }) => {
    if(!cartItem.item) return <StyledCartItem>
    This item has been removed
    <RemoveFromCart id={cartItem.id} />
    </StyledCartItem>
    return(
        <StyledCartItem>
            <img src={cartItem.item.image} alt={cartItem.item.title} width="100"/>
            <div className="cart-item-details">
                <h3>{cartItem.item.title}</h3>
                <p>
                    {formatMoney(cartItem.item.price * cartItem.quantity)}
                    {' - '}
                    {cartItem.quantity}&times; {formatMoney(cartItem.item.price)} each
                </p>
            </div>
            <RemoveFromCart id={cartItem.id} />
        </StyledCartItem>)
    };

CartItem.propTypes = {
    cartItem: PropTypes.object.isRequired
}

export default CartItem;