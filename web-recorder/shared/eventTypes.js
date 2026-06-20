const EventTypes = {
  NAVIGATE: 'Navigate',
  CLICK: 'Click',
  TYPE: 'Type',
  ASSERT: 'Assert',
  ASSERT_URL: 'Assert URL'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventTypes;
}

export default EventTypes;
