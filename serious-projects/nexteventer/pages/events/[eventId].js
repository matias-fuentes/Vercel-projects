import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import { fetchData, convertToArray } from '../../helpers/fetch-util';
import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import Comments from '../../components/input/comments';
import ErrorAlert from '../../components/ui/error-alert';

export default function EventDetailPage(props) {
    if (props.error) {
        return (
            <ErrorAlert>
                An error has occurred while fetching the event! Please, try
                again.
            </ErrorAlert>
        );
    }

    const { info, eventId, comments } = props;
    const [clientSideComments, setClientSideComments] = useState([]);

    useEffect(() => {
        setClientSideComments(prevValue => [...prevValue, ...comments]);
    }, [comments]);

    return (
        <Fragment>
            <Head>
                <meta name="description" content={info.description} />
            </Head>
            <EventSummary title={info.title} />
            <EventLogistics
                date={info.date}
                address={info.location}
                image={info.image}
                imageAlt={info.title}
            />
            <EventContent>
                <p>{info.description}</p>
            </EventContent>
            <Comments
                eventId={eventId}
                comments={clientSideComments}
                setComments={setClientSideComments}
            />
        </Fragment>
    );
}

export async function getStaticProps(context) {
    const eventId = context.params.eventId;
    const { db, events, format } = process.env;
    const eventInfo = await fetchData(db + events + eventId + format);

    if (eventInfo !== 500) {
        let { info, comments } = eventInfo;
        comments = convertToArray(comments);

        return {
            props: {
                info,
                eventId,
                comments,
            },
            revalidate: 30,
        };
    }

    return {
        props: {
            error: eventInfo,
        },
    };
}

export async function getStaticPaths() {
    const { db, eventsFormat } = process.env;
    let events = await fetchData(db + eventsFormat);
    events = convertToArray(events);

    const paths = events.map(event => ({
        params: { eventId: event.id },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}
