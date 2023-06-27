import { useNavigate } from 'react-router-dom';

import AddMeetupForm from '../components/meetups/AddMeetupForm';

function AddMeetups() {
    const navigate = useNavigate();

    function AddMeetupsHandler(meetupData) {
        fetch('https://worldwidemeetups-default-rtdb.europe-west1.firebasedatabase.app/meetups.json', {
            method: 'POST',
            body: JSON.stringify(meetupData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => {
            navigate('/', { replace: true });
        });
    }

    return (
        <section>
            <h1>Add Meetups</h1>
            <AddMeetupForm onAddMeetups={AddMeetupsHandler} />
        </section>
    );
}

export default AddMeetups;
