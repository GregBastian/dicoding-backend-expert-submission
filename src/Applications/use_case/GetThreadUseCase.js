/* eslint-disable no-shadow */
class getThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadReplies = await this._threadRepository.getRepliesByThreadId(threadId);

    for (let i = 0; i < threadDetail.comments.length; i += 1) {
      threadDetail.comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === threadDetail.comments[i].id)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          return replyDetail;
        });
    }

    return threadDetail;
  }
}

module.exports = getThreadUseCase;
