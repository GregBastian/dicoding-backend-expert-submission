const NewComment = require('../NewComment');

describe('a NewComment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      content: 'some comment',
      threadId: 'thread-123,',
      userId: 'user-123',
    };

    // action & assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      content: {},
      threadId: 123,
      owner: 456,
      username: {},
    };

    // action & assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object properly', () => {
    const payload = {
      content: 'some kind of body',
      threadId: 'thread-123',
      owner: 'user-123',
      username: 'John Doe',
    };

    const newComment = new NewComment(payload);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
