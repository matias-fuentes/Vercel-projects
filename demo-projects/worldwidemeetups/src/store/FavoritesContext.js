import { createContext, useState } from 'react';

const FavoritesContext = createContext({
    favorites: [],
    totalFavorites: 0,
    addFavorite: favoriteMeetup => {},
    removeFavorite: meetupId => {},
    isFavorite: meetupId => {},
});

export function FavoritesContextProvider(props) {
    const [userFavorites, setUserFavorites] = useState([]);

    function addFavorite(favoriteMeetup) {
        setUserFavorites(prevUserFavorites => {
            return prevUserFavorites.concat(favoriteMeetup);
        });
    }

    function removeFavorite(meetupId) {
        setUserFavorites(prevUserFavorites => {
            return prevUserFavorites.filter(meetup => meetup.id !== meetupId);
        });
    }

    function isFavorite(meetupId) {
        return userFavorites.some(meetup => meetup.id === meetupId);
    }

    const context = {
        favorites: userFavorites,
        totalFavorites: userFavorites.length,
        addFavorite: addFavorite,
        removeFavorite: removeFavorite,
        isFavorite: isFavorite,
    };

    return (
        <FavoritesContext.Provider value={context}>
            {props.children}
        </FavoritesContext.Provider>
    );
}

export default FavoritesContext;
