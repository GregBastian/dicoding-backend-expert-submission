class DetailThread {
  constructor(payload) {
    this._verifypayload(payload);

    const {
      id, title, body, date, username, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifypayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({
    id, title, body, date, username, comments,
  }) {
    return (!id || !title || !body || !date || !username || !comments);
  }

  _isPayloadNotMeetDataTypeSpecification({
    id, title, body, date, username, comments,
  }) {
    return (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || !(Array.isArray(comments))
    );
  }
}

module.exports = DetailThread;
