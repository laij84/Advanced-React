import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            description
            price
        }
    }
`

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description 
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`

export default class UpdateItem extends Component {
    state = {}

    handleChange = e => {
        const { name, type, value } = e.target;
        console.log({name, type, value});
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({
            [name]: val
        })
    }

    updateItem = async (e, updateItemMutation) => {
        // Stop default form submit
        e.preventDefault();
        // Call mutation
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        })
    }

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id
            }}>
                {
                    ({ data, loading }) => {
                        console.log(data);
                        if(loading) return <p>Loading...</p>
                        if(!data.item) return <p>No Item Found for ID {this.props.id}</p>
                        return ( 
                            <Mutation 
                                mutation={UPDATE_ITEM_MUTATION} 
                                variables={this.state}
                            >
                                {
                                    (updateItem, { loading, error }) => (
                                        <Form onSubmit={ e => this.updateItem(e, updateItem)}>
                                            <Error error={error} />
                                            <fieldset 
                                                disabled={loading} 
                                                aria-busy={loading}
                                            >
                                                <label htmlFor="title">
                                                    Title
                                                    <input 
                                                        type="text" 
                                                        id="title" 
                                                        name="title" 
                                                        placeholder="Title" 
                                                        defaultValue={data.item.title}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </label>
                                                <label htmlFor="price">
                                                    Price
                                                    <input 
                                                        type="number" 
                                                        id="price" 
                                                        name="price" 
                                                        placeholder="Price" 
                                                        defaultValue={data.item.price}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </label>
                                                <label htmlFor="description">
                                                    Description
                                                    <textarea 
                                                        type="number" 
                                                        id="description" 
                                                        name="description" 
                                                        placeholder="Enter A Description" 
                                                        defaultValue={data.item.description}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </label>
                                                <button type="submit">
                                                    Sav{loading ? 'ing' : 'e'} Changes
                                                </button>
                                            </fieldset>
                                        </Form>       
                                    )
                                }
                            </Mutation>  
                        )
                    }
                }
            </Query>
        )
    }
}

export { UPDATE_ITEM_MUTATION }