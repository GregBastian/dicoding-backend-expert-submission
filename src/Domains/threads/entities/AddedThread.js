class AddedThread {
  constructor(payload) {
    this._verifypayload(payload);

    const {
      id, title, owner,
    } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifypayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ id, title, owner }) {
    return (!id || !title || !owner);
  }

  _isPayloadNotMeetDataTypeSpecification({ id, title, owner }) {
    return (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof owner !== 'string'
    );
  }
}

module.exports = AddedThread;
