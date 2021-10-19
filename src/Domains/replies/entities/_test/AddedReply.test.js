const AddedReply = require('../AddedReply');

describe('a AddedReply entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'some reply',
    };

    // action & assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      content: 145,
      owner: {},
    };

    // action & assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object properly', () => {
    const payload = {
      id: 'reply-123',
      content: 'some reply',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
