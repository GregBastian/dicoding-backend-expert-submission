const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // arrange
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedDetailThread = new DetailThread({
      id: 'thread-1234',
      title: 'some thread title',
      body: 'some thread body',
      date: '2020',
      username: 'John Doe',
      comments: [],
    });

    const retrievedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: 'comment A',
        replies: [],
        isDeleted: false,
        likeCount: 0,
      }),
      new DetailComment({
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
        replies: [],
        isDeleted: false,
        likeCount: 0,
      }),
    ];

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'reply A',
        date: '2021',
        username: 'user C',
        isDeleted: false,
      }),
      new DetailReply({
        id: 'reply-456',
        commentId: 'comment-456',
        content: 'reply B',
        date: '2021',
        username: 'user D',
        isDeleted: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockThreadRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(retrievedReplies));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(retrievedComments));

    mockLikeRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    const getThreadDetailUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // filtering retrievedComments to remove isDeleted and likeCount
    const {
      isDeleted: isDeletedCommentA,
      likeCount: likeCountCommentA,
      ...filteredCommentDetailsA
    } = retrievedComments[0];
    const {
      isDeleted: isDeletedCommentB,
      likeCount: likeCountCommentB,
      ...filteredCommentDetailsB
    } = retrievedComments[1];

    // filtering retrievedReplies to removed commentId and isDeleted
    const {
      commentId: commentIdReplyA, isDeleted: isDeletedReplyA,
      ...filteredReplyDetailsA
    } = retrievedReplies[0];
    const {
      commentId: commentIdReplyB, isDeleted: isDeletedReplyB,
      ...filteredReplyDetailsB
    } = retrievedReplies[1];

    const expectedCommentsAndReplies = [
      { ...filteredCommentDetailsA, replies: [filteredReplyDetailsA] },
      { ...filteredCommentDetailsB, replies: [filteredReplyDetailsB] },
    ];

    const expectedCommentsAndRepliesWithLikeCount = [
      {
        ...filteredCommentDetailsA,
        likeCount: likeCountCommentA,
        replies: [filteredReplyDetailsA],
      },
      {
        ...filteredCommentDetailsB,
        likeCount: likeCountCommentB,
        replies: [filteredReplyDetailsB],
      },
    ];

    getThreadDetailUseCase._checkIsDeletedComments = jest.fn()
      .mockImplementation(() => [filteredCommentDetailsA, filteredCommentDetailsB]);

    getThreadDetailUseCase._getRepliesForComments = jest.fn()
      .mockImplementation(() => expectedCommentsAndReplies);

    getThreadDetailUseCase._getLikeCountForComments = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCommentsAndRepliesWithLikeCount));

    // action
    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    // assert

    expect(useCaseResult).toEqual(new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsAndRepliesWithLikeCount,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});
