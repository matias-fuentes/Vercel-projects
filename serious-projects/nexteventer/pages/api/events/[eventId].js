import { fetchData } from '../../../helpers/fetch-util';

export default async function eventDetails(req, res) {
    const eventId = req.query.eventId;
    const { db, events, comments, format } = process.env;

    if (req.method === 'GET') {
        const event = await fetchData(db + events + eventId + format);

        if (event) {
            if (event === 500) {
                return res.status(500).json(event);
            }
            return res.status(200).json(event);
        }

        return res.status(200).json({});
    }

    const { email, name, comment } = req.body;
    const commentData = {
        email,
        name,
        comment,
    };

    const postStatus = await fetchData(
        db + events + eventId + comments,
        'POST',
        commentData
    );

    if (postStatus === 200) {
        return res.status(200).json();
    }

    return res.status(500).json({
        error: 'An error has occurred while trying to posting your comment',
    });
}
