/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
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

    threadDetail.comments = await this._checkIsDeletedComments(threadDetail.comments);
    threadDetail.comments = await this._getRepliesForComments(threadDetail.comments, threadReplies);
    threadDetail.comments = await this._getLikeCountForComments(threadDetail.comments);

    return threadDetail;
  }

  async _checkIsDeletedComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].content = comments[i].isDeleted ? '**komentar telah dihapus**' : comments[i].content;
      delete comments[i].isDeleted;
    }
    return comments;
  }

  async _getRepliesForComments(comments, threadReplies) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentId = comments[i].id;
      comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentId)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          replyDetail.content = replyDetail.isDeleted ? '**balasan telah dihapus**' : replyDetail.content;
          delete replyDetail.isDeleted;
          return replyDetail;
        });
    }
    return comments;
  }

  async _getLikeCountForComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentId = comments[i].id;
      comments[i].likeCount = await this._likeRepository
        .getLikeCountByCommentId(commentId);
    }
    return comments;
  }
}

module.exports = getThreadUseCase;
