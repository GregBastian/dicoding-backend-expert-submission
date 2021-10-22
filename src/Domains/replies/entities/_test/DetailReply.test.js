const DetailReply = require('../DetailReply');

describe('a DetailReply entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      content: 'some reply',
      date: '2021',
    };

    // action & assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      commentId: 999,
      content: 145,
      date: {},
      username: {},
      isDeleted: 0,
    };

    // action & assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object properly', () => {
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'some reply',
      date: '2021',
      username: 'John Doe',
      isDeleted: false,
    };

    const addedReply = new DetailReply(payload);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.date).toEqual(payload.date);
    expect(addedReply.username).toEqual(payload.username);
    expect(addedReply.is_deleted).toEqual(payload.is_deleted);
  });
});
