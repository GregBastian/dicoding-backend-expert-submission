class AddedUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('ADDED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('ADDED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ id, username, fullname }) {
    return (!id || !username || !fullname);
  }

  _isPayloadNotMeetDataTypeSpecification({ id, username, fullname }) {
    return (
      typeof id !== 'string'
    || typeof username !== 'string'
    || typeof fullname !== 'string'
    );
  }
}

module.exports = AddedUser;
