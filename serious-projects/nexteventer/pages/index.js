import Head from 'next/head';

import ErrorAlert from '../components/ui/error-alert';
import { Fragment } from 'react';
import { convertToArray, fetchData } from '../helpers/fetch-util';
import EventList from '../components/events/event-list';
import NewsletterRegistration from '../components/input/newsletter-registration';

export default function HomePage(props) {
    const layout = (
        <Fragment>
            <Head>
                <meta name='description' content='Find a lot of great events that allow you to evolve...' />
            </Head>
            <NewsletterRegistration />
        </Fragment>
    );

    if (props.events === 500) {
        return (
            <Fragment>
                {layout}
                <ErrorAlert>An error has occurred while trying to fetch the events! Please, try again.</ErrorAlert>
            </Fragment>
        );
    }

    return (
        <Fragment>
            {layout}
            <EventList items={props.events} />
        </Fragment>
    );
}

export async function getStaticProps() {
    const { db, eventsFormat } = process.env;
    let allEvents = await fetchData(db + eventsFormat);
    let featuredEvents;
    if (allEvents === 500) {
        featuredEvents = allEvents;
    } else {
        allEvents = convertToArray(allEvents);
        featuredEvents = allEvents.filter(event => event.info.isFeatured);
    }

    return {
        props: {
            events: featuredEvents,
        },
        revalidate: 1800,
    };
}
