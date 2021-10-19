class DeleteCommentUseCase {
  constructor({
    commentRepository, authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParam, useCaseHeader) {
    const { threadId, commentId } = useCaseParam;
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: ownerId } = await this._authenticationTokenManager.decodePayload(accessToken);

    await this._commentRepository.checkCommentIsExist({ threadId, commentId });
    await this._commentRepository.verifyCommentAccess({ commentId, ownerId });
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
