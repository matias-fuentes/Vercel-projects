import { Link } from 'react-router-dom';
import { useContext } from 'react';

import classes from './Header.module.css';
import FavoritesContext from '../../store/FavoritesContext';

function Header() {
    const useFavoritesContext = useContext(FavoritesContext);

    return (
        <header className={classes.header}>
            <div className={classes.logo}>Worldwide Meetups</div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Meetups</Link>
                    </li>
                    <li>
                        <Link to="/add-meetups">Add Meetups</Link>
                    </li>
                    <li>
                        <Link to="/favorites-meetups">
                            Favorites Meetups
                            <span className={classes.badge}>
                                {useFavoritesContext.totalFavorites}
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
