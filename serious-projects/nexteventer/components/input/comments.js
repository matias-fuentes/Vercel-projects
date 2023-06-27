import { useState } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';

function Comments(props) {
    const { eventId, comments, setComments } = props;
    const [showComments, setShowComments] = useState(false);

    function toggleCommentsHandler() {
        setShowComments(prevStatus => !prevStatus);
    }

    return (
        <section className={classes.comments}>
            <button onClick={toggleCommentsHandler}>
                {showComments ? 'Hide' : 'Show'} Comments
            </button>
            {showComments && (
                <NewComment eventId={eventId} setComments={setComments} />
            )}
            {showComments && <CommentList comments={comments} />}
        </section>
    );
}

export default Comments;
