const NewReply = require('../NewReply');

describe('a NewReply entity', () => {
  it('should throw error if payload does not meeet criteria', () => {
    // arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // action & assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      commentId: 234,
      content: {},
      owner: 123,
    };

    // action & assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object properly', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'some reply',
      owner: 'user-123',
    };

    const newReply = new NewReply(payload);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.owner).toEqual(payload.owner);
  });
});
