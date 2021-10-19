class ThreadsHandler {
  constructor({ addThreadUseCase, getThreadUseCase }) {
    this._addThreadUseCase = addThreadUseCase;
    this._getThreadUseCase = getThreadUseCase;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    const addedThread = await this._addThreadUseCase.execute(request.payload, headerAuthorization);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const detailThread = await this._getThreadUseCase.execute(request.params);
    const response = h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    });

    return response;
  }
}

module.exports = ThreadsHandler;
