const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId });
    });
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addReply function', () => {
      it('addReply function should add reply in database', async () => {
        // arrange
        const newReply = new NewReply({
          commentId: 'comment-123',
          owner: 'user-123',
          content: 'some reply',
        });

        const fakeIdGenerator = () => '123';
        function fakeDateGenerator() {
          this.toISOString = () => '2021';
        }
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool, fakeIdGenerator, fakeDateGenerator,
        );

        // action
        const addedReply = await replyRepositoryPostgres.addReply(newReply);
        const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);

        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: newReply.content,
          owner: newReply.owner,
        }));
        expect(reply).toBeDefined();
      });
    });

    describe('checkReplyIsExist function', () => {
      it('should not throw error if reply exists', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.checkReplyIsExist({
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-123',
        })).resolves.toBeUndefined();
      });

      it('should throw error if reply does not exist', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        expect(replyRepositoryPostgres.checkReplyIsExist({
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-789',
        })).rejects.toThrowError('reply yang Anda cari tidak ada');
      });
    });

    describe('verifyReplyAccess function', () => {
      it('should not throw error when user has access', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.verifyReplyAccess({
          ownerId: 'user-123',
          replyId: 'reply-123',
        })).resolves.toBeUndefined();
      });

      it('should throw error when user does not have access', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.verifyReplyAccess({
          ownerId: 'user-456',
          replyId: 'reply-123',
        })).rejects.toThrowError('Anda tidak berhak melakukan aksi tersebut pada reply ini');
      });
    });

    describe('deleteReplyById function', () => {
      it('should not throw error when reply deleted successfully', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.deleteReplyById('reply-123'))
          .resolves.toBeUndefined();
      });

      it('deleted reply should have is_deleted column as true in database', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});
        await replyRepositoryPostgres.deleteReplyById('reply-123');

        const reply = await RepliesTableTestHelper.findReplyById('reply-123');
        expect(reply.is_deleted).toEqual(true);
      });

      it('should throw error when reply has been already deleted', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        expect(replyRepositoryPostgres.deleteReplyById('reply-123'))
          .rejects.toThrowError('reply yang ingin Anda hapus tidak ada');
      });
    });
  });
});
