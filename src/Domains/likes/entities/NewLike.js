class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      commentId, owner,
    } = payload;

    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ commentId, owner }) {
    return (!commentId || !owner);
  }

  _isPayloadNotMeetDataTypeSpecification({ commentId, owner }) {
    return (
      typeof commentId !== 'string'
       || typeof owner !== 'string'
    );
  }
}

module.exports = NewReply;
