import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
    <User>
    {({data: { me }}) => (
        <NavStyles>
            <li>
                <Link href="/items">
                    <a>Shop</a>
                </Link>
            </li>
            {me && (
                <>
                <li>
                    <Link href="/sell">
                        <a>Sell</a>
                    </Link>
                </li>
                <li>
                    <Link href="/orders">
                        <a>Orders</a>
                    </Link>
                </li>
                <li>
                    <Link href="/me">
                        <a>Account</a>
                    </Link>
                </li>   
                <li>
                    <Signout/>
                </li>
                </>
            )}
            {!me && (
                <li>
                    <Link href="/signup">
                        <a>Sign in</a>
                    </Link>
                </li>
            )}

        </NavStyles>
    )}
    </User>
    
)

export default Nav;