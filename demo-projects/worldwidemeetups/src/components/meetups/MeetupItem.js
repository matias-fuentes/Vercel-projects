import { useContext } from 'react';

import classes from './MeetupItem.module.css';
import Card from '../ui/Card';
import FavoritesContext from '../../store/FavoritesContext';

function MeetupItem(props) {
    const useFavoritesContext = useContext(FavoritesContext);
    const isFavorite = useFavoritesContext.isFavorite(props.id);

    function toggleFavStatus() {
        if (isFavorite) {
            useFavoritesContext.removeFavorite(props.id);
        } else {
            useFavoritesContext.addFavorite({
                id: props.id,
                title: props.title,
                description: props.description,
                image: props.image,
                address: props.address,
            });
        }
    }

    return (
        <li className={classes.item}>
            <Card>
                <div className={classes.image}>
                    <img src={props.image} alt={props.title}></img>
                </div>
                <div className={classes.content}>
                    <h3>{props.title}</h3>
                    <address>{props.addres}</address>
                    <p>{props.description}</p>
                </div>
                <div className={classes.actions}>
                    <button onClick={toggleFavStatus}>
                        {isFavorite
                            ? 'Remove From Favorites'
                            : 'Add To Favorites'}
                    </button>
                </div>
            </Card>
        </li>
    );
}

export default MeetupItem;
