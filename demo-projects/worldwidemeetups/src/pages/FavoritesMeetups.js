import { useContext } from 'react';

import FavoritesContext from '../store/FavoritesContext';
import MeetupList from '../components/meetups/MeetupList';

function FavoritesMeetups() {
    const useFavoritesContext = useContext(FavoritesContext);
    let content;

    if (useFavoritesContext.totalFavorites === 0) {
        content = (
            <p>You have no favorites meetups added. You wanna add some?</p>
        );
    } else {
        content = <MeetupList meetups={useFavoritesContext.favorites} />;
    }

    return (
        <section>
            <h1>My Favorites</h1>
            {content}
        </section>
    );
}

export default FavoritesMeetups;
