import React, { Component } from 'react'
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import  { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                {title_contains: $searchTerm},
                { description_contains: $searchTerm }
            ]            
        }) {
            id
            image
            title
        }
    }
`

export default class AutoComplete extends Component {
    state = {
        items: [],
        loading: false
    }
    onChange = debounce(async (e, client) => {
        console.log(e);
        this.setState({loading: true});

        const res = await client.query({
           query: SEARCH_ITEMS_QUERY,
           variables: { searchTerm: e.target.value}
        });

        this.setState({
            loading: false,
            items: res.data.items,
        });
        console.log(res);     
    }, 350);

    routeToItem = (item) => {
        Router.push({
            pathname: '/item',
            query: {
                id: item.id
            }
        })
    };

    render() {
        resetIdCounter();
        return (
            <SearchStyles>
                <Downshift 
                    itemToString={item => (item === null ? '' : item.title)}
                    onChange={this.routeToItem}
                >
                    {({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex}) => (
                        <div>
                            <ApolloConsumer>
                                {(client) => (
                                    <input 
                                        {...getInputProps({
                                            type: 'search',
                                            placeholder: "Search for an item",
                                            id: 'search',
                                            className: this.state.loading ? 'loading' : '',
                                            onChange: e => {
                                                // allows you to access event properties inside async function
                                                e.persist();
                                                this.onChange(e, client);
                                            }
                                        })}
                                    />
                                )}   
                            </ApolloConsumer>
                            { isOpen && (
                                <DropDown>
                                    {this.state.items.map((item,index) => (
                                        <DropDownItem 
                                            key={item.id}
                                            {...getItemProps({item})}
                                            highlighted={ index === highlightedIndex}
                                        >
                                            <img src={item.image} alt={item.title} width="50" />
                                            {item.title}
                                        </DropDownItem>
                                    ))}
                                    {!this.state.items.length && !this.state.loading && (<DropDownItem>Nothing found for {inputValue}</DropDownItem>)}
                                </DropDown>
                            )}
                        </div>
                    )}
                </Downshift>
            </SearchStyles>
        )
    }
}
