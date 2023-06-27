import { fetchData } from '../../helpers/fetch-util';

export default async function newsletter(req, res) {
    const { db, users } = process.env;
    if (req.method === 'GET') {
        const usersObj = await fetchData(db + users);

        if (usersObj) {
            if (usersObj === 500) {
                return res.status(500).json();
            }
            return res.status(200).json(usersObj);
        }

        return res.status(200).json({});
    } else {
        const email = { email: req.body.email };
        const postStatus = await fetchData(db + users, 'POST', email);

        if (postStatus === 200) {
            return res.status(200).json();
        }

        return res
            .status(500)
            .json({ error: 'An error has occurred while signing up' });
    }
}
