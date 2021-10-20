const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchestrate the add like use case properly', async () => {
    // arrange
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    const userIdFromAccessToken = 'user-123';

    const expectedAccessToken = 'accessToken';

    /** creating dependancies for use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed functions */
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // action
    await addLikeUseCase.execute(useCaseParam, useCaseHeader);

    // assert
    expect(mockAuthenticationTokenManager.getTokenFromHeader)
      .toBeCalledWith(useCaseHeader.authorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);
    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam);
    expect(mockLikeRepository.addLike).toBeCalledWith(new NewLike({
      commentId: useCaseParam.commentId,
      owner: userIdFromAccessToken,
    }));
  });
});
