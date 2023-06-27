import { useRef } from 'react';

import classes from './AddMeetupForm.module.css';
import Card from '../ui/Card';

function AddMeetupForm(props) {
    const titleRef = useRef();
    const imageRef = useRef();
    const addressRef = useRef();
    const descriptionRef = useRef();

    function submitHandler(e) {
        e.preventDefault();

        const title = titleRef.current.value;
        const image = imageRef.current.value;
        const address = addressRef.current.value;
        const description = descriptionRef.current.value;

        const meetupData = {
            title: title,
            image: image,
            address: address,
            description: description,
        };

        props.onAddMeetups(meetupData);
    }

    return (
        <Card>
            <form className={classes.form} onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="title">Meetup Title</label>
                    <input
                        type="text"
                        required
                        id="title"
                        ref={titleRef}
                    ></input>
                </div>
                <div className={classes.control}>
                    <label htmlFor="image">Meetup Image</label>
                    <input
                        type="url"
                        required
                        id="image"
                        ref={imageRef}
                    ></input>
                </div>
                <div className={classes.control}>
                    <label htmlFor="address">Meetup Address</label>
                    <input
                        type="text"
                        required
                        id="address"
                        ref={addressRef}
                    ></input>
                </div>
                <div className={classes.control}>
                    <label htmlFor="description">Meetup Description</label>
                    <textarea
                        required
                        id="description"
                        ref={descriptionRef}
                    ></textarea>
                </div>
                <div className={classes.actions}>
                    <button>Add Meetup</button>
                </div>
            </form>
        </Card>
    );
}

export default AddMeetupForm;
