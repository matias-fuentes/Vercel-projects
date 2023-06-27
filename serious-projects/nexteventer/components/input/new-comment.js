import { useRef, useContext } from 'react';

import NotificationContext from '../../contexts/notification-context';
import { fetchData } from '../../helpers/fetch-util';
import classes from './new-comment.module.css';

export default function NewComment(props) {
    const { eventId, setComments } = props;
    const useNotificationContext = useContext(NotificationContext);

    const emailInputRef = useRef();
    const nameInputRef = useRef();
    const commentInputRef = useRef();

    async function sendCommentHandler(e) {
        e.preventDefault();

        const email = emailInputRef.current.value;
        const name = nameInputRef.current.value;
        const comment = commentInputRef.current.value;

        if (
            !email ||
            email.trim() === '' ||
            !email.includes('@') ||
            !name ||
            name.trim() === '' ||
            !comment ||
            comment.trim() === ''
        ) {
            useNotificationContext.showNotification({
                title: 'Error while posting comment!',
                message:
                    'Error! The data entered is invalid. Please, try again',
                status: 'error',
            });
        } else {
            const commentData = {
                email,
                name,
                comment,
            };

            setComments(prevValue => [...prevValue, commentData]);

            useNotificationContext.showNotification({
                title: 'Posting comment...',
                message: 'Adding comment to the event...',
                status: 'pending',
            });

            const postStatus = await fetchData(
                `https://nexteventer.vercel.app/api/events/${eventId}`,
                'POST',
                commentData
            );

            if (postStatus === 200) {
                useNotificationContext.showNotification({
                    title: 'Comment successfully posted!',
                    message:
                        'Your comment has been successfully added to the event comments section',
                    status: 'success',
                });
            } else {
                useNotificationContext.showNotification({
                    title: 'Error while posting comment!',
                    message: postStatus.error,
                    status: 'error',
                });
            }
        }
    }

    return (
        <form className={classes.form}>
            <div className={classes.row}>
                <div className={classes.control}>
                    <label htmlFor="email">Your email</label>
                    <input type="email" id="email" ref={emailInputRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor="name">Your name</label>
                    <input type="text" id="name" ref={nameInputRef} />
                </div>
            </div>
            <div className={classes.control}>
                <label htmlFor="comment">Your comment</label>
                <textarea
                    id="comment"
                    rows="5"
                    ref={commentInputRef}
                ></textarea>
            </div>
            <button onClick={sendCommentHandler}>Submit</button>
        </form>
    );
}
