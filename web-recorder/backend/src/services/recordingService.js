let events = [];

function addEvent(event) {
    events.push(event);
}

function clearEvents() {
    events = [];
}

function getEvents() {
    return events;
}

module.exports = {
    addEvent,
    clearEvents,
    getEvents
};