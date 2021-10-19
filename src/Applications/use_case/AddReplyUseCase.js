const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseParam, useCaseHeader) {
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);

    await this._commentRepository.checkCommentBelongsToThread(useCaseParam);
    const newReply = new NewReply({
      ...useCasePayload, ...useCaseParam, owner,
    });
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
