const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const injections = require('../../injections');
const createServer = require('../createServer');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('endpoints concerning CRUD on threads', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(injections);

      /* add user and gain access token */
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should respond with 403 when no access token is provided', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(injections);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 when payload does not meet structure specifications', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: 'lorem ipsum',
      };

      const server = await createServer(injections);

      /* add user and gain access token */
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response with 400 when payload does not meet data type specifications', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: {},
        body: 123,
      };

      const server = await createServer(injections);

      /* add user and gain access token */
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200 with thread details and comments', async () => {
      const server = await createServer(injections);

      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'JohnDoe' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'JaneDoe' });
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId, owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-456', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-456', commentId: 'comment-123', owner: 'user-456' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(1);
      expect(responseJson.data.thread.comments[1].likeCount).toEqual(0);
    });

    it('should respond with 200 and with thread details with empty comments', async () => {
      const server = await createServer(injections);

      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'John Doe' });
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(injections);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
