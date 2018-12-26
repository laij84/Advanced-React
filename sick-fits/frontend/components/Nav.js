import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => (
    <NavStyles>
    <li>
        <Link href="/items">
            <a>Shop</a>
        </Link>
    </li>
    <li>
        <Link href="/sell">
            <a>Sell</a>
        </Link>
    </li>
    <li>
        <Link href="/signup">
            <a>Signup</a>
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
    </NavStyles>
)

export default Nav;