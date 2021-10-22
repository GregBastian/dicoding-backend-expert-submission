const NewLike = require('../../Domains/likes/entities/NewLike');

class AddLikeUseCase {
  constructor({
    commentRepository, likeRepository, authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParam, useCaseHeader) {
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._commentRepository.checkCommentIsExist(useCaseParam);
    const newLike = new NewLike({
      commentId: useCaseParam.commentId, owner,
    });

    if (await this._likeRepository.checkLikeIsExists(newLike)) {
      await this._likeRepository.deleteLikeByCommentIdAndOwner(newLike);
    } else {
      await this._likeRepository.addLike(newLike);
    }
  }
}

module.exports = AddLikeUseCase;
