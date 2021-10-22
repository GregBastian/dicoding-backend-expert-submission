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
      // modify comment content based on is_deleted status
      threadDetail.comments[i].content = threadDetail.comments[i].isDeleted ? '**komentar telah dihapus**' : threadDetail.comments[i].content;
      delete threadDetail.isDeleted;

      // get replies
      const commentId = threadDetail.comments[i].id;
      threadDetail.comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentId)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          replyDetail.content = replyDetail.isDeleted ? '**balasan telah dihapus**' : replyDetail.content;
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
