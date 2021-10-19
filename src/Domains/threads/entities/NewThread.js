class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ title, body, owner }) {
    return (!title || !body || !owner);
  }

  _isPayloadNotMeetDataTypeSpecification({ title, body, owner }) {
    return (
      typeof title !== 'string'
      || typeof body !== 'string'
      || typeof owner !== 'string'
    );
  }
}

module.exports = NewThread;
