class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, threadId, owner,
    } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ content, threadId, owner }) {
    return (!content || !threadId || !owner);
  }

  _isPayloadNotMeetDataTypeSpecification({ content, threadId, owner }) {
    return (
      typeof content !== 'string'
    || typeof threadId !== 'string'
    || typeof owner !== 'string'
    );
  }
}

module.exports = NewComment;
