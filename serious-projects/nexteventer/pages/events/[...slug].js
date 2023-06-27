import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';

import { convertToArray } from '../../helpers/fetch-util';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';

export default function FilteredEventsPage() {
    const [loadedEvents, setLoadedEvents] = useState();
    const router = useRouter();
    const filterData = router.query.slug;
    const { data, error } = useSWR(
        'https://nexteventer.vercel.app/api/events',
        url => fetch(url).then(res => res.json())
    );

    useEffect(() => {
        if (data) {
            const events = convertToArray(data);
            setLoadedEvents(events);
        }
    }, [data]);

    let pageHeadData = (
        <Head>
            <meta name="description" content={`A list of filtered events.`} />
        </Head>
    );

    if (error) {
        return (
            <ErrorAlert>
                An error has occurred while trying to fetch the events! Please,
                try again.
            </ErrorAlert>
        );
    }

    if (!loadedEvents) {
        return (
            <Fragment>
                {pageHeadData}
                <h2 className="center">Loading...</h2>
            </Fragment>
        );
    }

    const filteredYear = filterData[0];
    const filteredMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    pageHeadData = (
        <Head>
            <meta
                name="description"
                content={`All events for ${numMonth}/${numYear}.`}
            />
        </Head>
    );

    if (
        isNaN(numYear) ||
        isNaN(numMonth) ||
        numYear > 2030 ||
        numYear < 2021 ||
        numMonth < 1 ||
        numMonth > 12
    ) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert>
                    <p>Invalid filter. Please adjust your values!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    const filteredEvents = loadedEvents.filter(event => {
        const eventDate = new Date(event.info.date);
        return (
            eventDate.getFullYear() === numYear &&
            eventDate.getMonth() === numMonth - 1
        );
    });

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert>
                    <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    const date = new Date(numYear, numMonth - 1);

    return (
        <Fragment>
            {pageHeadData}
            <ResultsTitle date={date} />
            <EventList items={filteredEvents} />
        </Fragment>
    );
}
