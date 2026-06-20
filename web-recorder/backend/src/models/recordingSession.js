class RecordingSession {

    constructor() {

        this.id = Date.now();

        this.startTime = new Date();

        this.endTime = null;

        this.status = "recording";

        this.events = [];
    }

    addEvent(event) {
        this.events.push(event);
    }

    stop() {

        this.status = "completed";

        this.endTime = new Date();
    }

    getEvents() {
        return this.events;
    }
}

module.exports = RecordingSession;