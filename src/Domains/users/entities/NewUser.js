class NewUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (this._isUsernameAboveLimitChar(payload)) {
      throw new Error('NEW_USER.USERNAME_LIMIT_CHAR');
    }

    if (this._isUsernameNotContainRestrictedCharacters(payload)) {
      throw new Error('NEW_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }

  _isPayloadNotContainNeededProperty({ username, password, fullname }) {
    return (!username || !password || !fullname);
  }

  _isPayloadNotMeetDataTypeSpecification({ username, password, fullname }) {
    return (
      typeof username !== 'string'
    || typeof password !== 'string'
    || typeof fullname !== 'string'
    );
  }

  _isUsernameAboveLimitChar({ username }) {
    return (username.length > 50);
  }

  _isUsernameNotContainRestrictedCharacters({ username }) {
    return (!username.match(/^[\w]+$/));
  }
}

module.exports = NewUser;
