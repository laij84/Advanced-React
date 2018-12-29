import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION(
        $email: String!,
        $password: String!,
    ) {
        signin(
            email: $email,
            password: $password
        ) {
            id
            email
            name
        }
    }
`

export default class Signin extends Component {
    state = {
        password: '',
        email: '',
    }
    saveToState = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    render() {
        return (
            <Mutation 
                mutation={SIGNIN_MUTATION}
                variables={this.state}
                refetchQueries={[
                    {query: CURRENT_USER_QUERY}
                ]}
            >
            {(signin, {loading, error}) => {
                return(
                    <Form method="post" onSubmit={ async e => {
                        e.preventDefault();
                        await signin();
                        this.setState({email: '', password: ''});
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign in</h2>
                            <Error error={error} />
                            <label htmlFor="email">
                            Email
                            <input 
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={this.state.email}
                                onChange={this.saveToState}
                                required
                            />
                            </label>
                            <label htmlFor="password">
                            Password
                            <input 
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.saveToState}
                                required
                            />
                            </label>
                            <button type="submit">Signin</button>
                        </fieldset>
                    </Form>
                )
            }}
            </Mutation>
        )
    }
}
