class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      commentId, owner, content,
    } = payload;

    this.commentId = commentId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ commentId, owner, content }) {
    return (!commentId || !owner || !content);
  }

  _isPayloadNotMeetDataTypeSpecification({ commentId, owner, content }) {
    return (
      typeof commentId !== 'string'
     || typeof owner !== 'string'
     || typeof content !== 'string'
    );
  }
}

module.exports = NewReply;
