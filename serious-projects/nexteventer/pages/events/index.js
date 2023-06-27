import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import ErrorAlert from '../../components/ui/error-alert';
import { convertToArray, fetchData } from '../../helpers/fetch-util';
import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';

function AllEventsPage(props) {
    const router = useRouter();
    const { events } = props;
    const layout = (
        <Fragment>
            <Head>
                <meta
                    name="description"
                    content="Find a lot of great events that allow you to evolve..."
                />
            </Head>
            <EventsSearch onSearch={findEventsHandler} />
        </Fragment>
    );

    function findEventsHandler(year, month) {
        const fullPath = `/events/${year}/${month}`;

        router.push(fullPath);
    }

    if (props.events === 500) {
        return (
            <Fragment>
                {layout}
                <ErrorAlert>
                    An error has occurred while trying to fetch the events!
                    Please, try again.
                </ErrorAlert>
            </Fragment>
        );
    }

    return (
        <Fragment>
            {layout}
            <EventList items={events} />
        </Fragment>
    );
}

export async function getStaticProps() {
    const { db, eventsFormat } = process.env;
    let events = await fetchData(db + eventsFormat);
    if (events !== 500) {
        events = convertToArray(events);
    }

    return {
        props: {
            events,
        },
        revalidate: 60,
    };
}

export default AllEventsPage;
