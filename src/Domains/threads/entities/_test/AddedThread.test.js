const AddedThread = require('../AddedThread');

describe('an AddedThread entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'thread-1234',
      title: 'lorem ipsum',
    };

    // action and assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    // arrange
    const payload = {
      id: 'thread-1234',
      title: 1984,
      owner: true,
    };

    // action and assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'Lorem ipsum',
      owner: 'John Doe',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
