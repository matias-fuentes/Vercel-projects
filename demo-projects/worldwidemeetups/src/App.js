import { Route, Routes } from 'react-router-dom';

import Meetups from './pages/Meetups';
import AddMeetups from './pages/AddMeetups';
import FavoritesMeetups from './pages/FavoritesMeetups';
import Layout from './components/layout/Layout';

function App() {
    document.title = 'Worldwide Meetups';

    return (
        <Layout>
            <Routes>
                <Route path='/' element={<Meetups />} />
                <Route path='/add-meetups' element={<AddMeetups />} />
                <Route path='/favorites-meetups' element={<FavoritesMeetups />} />
            </Routes>
        </Layout>
    );
}

export default App;
