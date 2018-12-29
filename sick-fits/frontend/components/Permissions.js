import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
];

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name
            email
        }
    }
`;

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
        {({data, loading, error}) => (
            <div>
                <h2>Manage Permissions</h2>
                <Error error={error}/>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            {possiblePermissions.map( permission => <th key={permission}>{permission}</th>)}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.map(user => <UserPermissions user={user} key={user.id}/>
                        )}
                    </tbody>
                </Table>
            </div>
        )}
    </Query>
);


class UserPermissions extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array
        }).isRequired
    };

    state = {
        permissions: this.props.user.permissions
    };

    handlePermissionChange = (e) => {
        const checkbox = e.target;
        // copy current permissions
        let updatedPermissions = [...this.state.permissions];

        //Remove / Add permission
        if(checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
        }
        this.setState({
            permissions: updatedPermissions
        })
    }

    render() {
        const user = this.props.user;
        return (
            <Mutation 
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id
                }}
            >
                {(updatePermissions, {loading, error})=>(
                    <>
                    {error && <tr><td colspan="8"><Error error={error} /></td></tr>}
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        {
                            possiblePermissions.map(permission => (
                                <td key={permission}>
                                    <label htmlFor={`${user.id}-permission-${permission}`}>
                                        <input 
                                            type="checkbox" id={`${user.id}-permission-${permission}`}
                                            checked={this.state.permissions.includes(permission)}
                                            value={permission}
                                            onChange={this.handlePermissionChange}
                                        />
                                    </label>
                                </td>
                            ))
                        }
                        <td>
                            <SickButton 
                                type="button"
                                onClick={updatePermissions}
                                disabled={loading}
                            >
                                Updat{ loading ? 'ing' : 'e'}
                            </SickButton>
                        </td>
                    </tr>
                    </>
                )}
            </Mutation>
        )
    }
}

export default Permissions;