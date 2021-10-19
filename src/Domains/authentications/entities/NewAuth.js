class NewAuth {
  constructor(payload) {
    this._verifyPayload(payload);

    const { accessToken, refreshToken } = payload;

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ accessToken, refreshToken }) {
    return (!accessToken || !refreshToken);
  }

  _isPayloadNotMeetDataTypeSpecification({ accessToken, refreshToken }) {
    return (
      typeof accessToken !== 'string'
      || typeof refreshToken !== 'string'
    );
  }
}

module.exports = NewAuth;
