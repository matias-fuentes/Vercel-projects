import EventItem from './event-item';
import classes from './event-list.module.css';

function EventList(props) {
    const { items } = props;

    return (
        <ul className={classes.list}>
            {items.map(event => (
                <EventItem
                    key={event.id}
                    id={event.id}
                    title={event.info.title}
                    location={event.info.location}
                    date={event.info.date}
                    image={event.info.image}
                />
            ))}
        </ul>
    );
}

export default EventList;
