let events = [];

function addEvent(event) {
    events.push(event);
}

function addEvents(newEvents) {
    events.push(...newEvents);
}

function getEvents() {
    return events;
}

function clearEvents() {
    events = [];
}

module.exports = {
    addEvent,
    addEvents,
    getEvents,
    clearEvents
};