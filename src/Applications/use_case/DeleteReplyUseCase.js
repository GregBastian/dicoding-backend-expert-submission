class DeleteReplyUseCase {
  constructor({ replyRepository, authenticationTokenManager }) {
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParam, useCaseHeader) {
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: ownerId } = await this._authenticationTokenManager.decodePayload(accessToken);

    await this._replyRepository.checkReplyIsExist(useCaseParam);
    await this._replyRepository.verifyReplyAccess({ ownerId, replyId: useCaseParam.replyId });
    await this._replyRepository.deleteReplyById(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
