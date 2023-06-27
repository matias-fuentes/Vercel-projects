import { fetchData } from '../../../helpers/fetch-util';

export default async function events(req, res) {
    const { db, eventsFormat } = process.env;
    const events = await fetchData(db + eventsFormat);

    if (events === 500) {
        return res.status(500).json();
    }

    return res.status(200).json(events);
}
