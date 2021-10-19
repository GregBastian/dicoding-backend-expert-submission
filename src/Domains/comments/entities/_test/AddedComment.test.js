const AddedComment = require('../AddedComment');

describe('a AddedComment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'some comment',
    };

    // action & assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      content: 145,
      owner: {},
    };

    // action & assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object properly', () => {
    const payload = {
      id: 'comment-123',
      content: 'somekind content',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
