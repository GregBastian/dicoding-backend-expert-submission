class LikesHandler {
  constructor({ addLikeUseCase }) {
    this._addLikeUseCase = addLikeUseCase;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    await this._addLikeUseCase.execute(
      request.params, request.headers,
    );
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
