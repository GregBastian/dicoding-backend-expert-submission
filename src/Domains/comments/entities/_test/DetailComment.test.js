const DetailComment = require('../DetailComment');

describe('a DetailComment entity', () => {
  it('should create DetailComment object properly', () => {
    const payload = {
      id: 'comment-123',
      username: 'some comment',
      date: 'thread-123,',
      content: 'some comment',
      replies: [],
      likeCount: 0,
      isDeleted: false,
    };

    const detailComment = new DetailComment(payload);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.replies).toEqual(payload.replies);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
    expect(detailComment.isDeleted).toEqual(payload.isDeleted);
  });

  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      username: 'some comment',
      date: 'thread-123,',
    };

    // action & assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      username: {},
      date: 2021,
      content: { content: 'some content' },
      replies: 'replies',
      likeCount: '0',
      isDeleted: 'false',
    };

    // action & assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
