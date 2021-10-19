/* eslint-disable no-shadow */
class getThreadUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadReplies = await this._threadRepository.getRepliesByThreadId(threadId);

    for (let i = 0; i < threadDetail.comments.length; i += 1) {
      const commentId = threadDetail.comments[i].id;

      // get replies
      threadDetail.comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentId)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          return replyDetail;
        });

      // get like count
      // eslint-disable-next-line no-await-in-loop
      threadDetail.comments[i].likeCount = await this._likeRepository
        .getLikeCountByCommentId(commentId);
    }

    return threadDetail;
  }
}

module.exports = getThreadUseCase;
