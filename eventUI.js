import React, { useEffect, useState } from 'react';

function EventNotifier() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000');
        socket.onmessage = function(event) {
            const newEvent = JSON.parse(event.data);
            setEvents(prevEvents => [...prevEvents, newEvent]);
        };
        return () => socket.close();
    }, []);

    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <a href={event.url}>{event.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EventNotifier;
