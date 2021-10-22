const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    });
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addComment function', () => {
      it('addComment function should add database entry for said comment', async () => {
        // arrange
        const newComment = new NewComment({
          content: 'some content',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        function fakeDateGenerator() {
          this.toISOString = () => '2021';
        }
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, fakeIdGenerator, fakeDateGenerator,
        );

        // action
        const addedComment = await commentRepositoryPostgres.addComment(newComment);
        const comments = await CommentsTableTestHelper.findCommentById(addedComment.id);

        // assert
        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        }));
        expect(comments).toBeDefined();
      });
    });

    describe('deleteCommentById', () => {
      it('should be able to delete added comment by id', async () => {
      // arrange
        const addedComment = {
          id: 'comment-123',
          threadId: 'thread-123',
        };

        await CommentsTableTestHelper.addComment({
          id: addedComment.id, threadId: addedComment.threadId,
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        // action
        await commentRepositoryPostgres.deleteCommentById(addedComment.id);
        const comment = await CommentsTableTestHelper.findCommentById('comment-123');

        // assert
        expect(comment.is_deleted).toEqual(true);
      });

      it('should throw error when comment that wants to be deleted does not exist', async () => {
      // arrange
        const addedCommentId = 'comment-123';

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        // action & assert
        await expect(commentRepositoryPostgres.deleteCommentById(addedCommentId)).rejects.toThrowError('tidak bisa menghapus comment karena comment tidak ada');
      });
    });

    describe('getCommentsByThreadId', () => {
      it('should return all comments from a thread', async () => {
        const firstComment = {
          id: 'comment-123', date: '2020', content: 'first comment', isDeleted: false, replies: [], likeCount: 0,
        };
        const secondComment = {
          id: 'comment-456', date: '2022', content: 'second comment', isDeleted: false, replies: [], likeCount: 0,
        };
        await CommentsTableTestHelper.addComment(firstComment);
        await CommentsTableTestHelper.addComment(secondComment);
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );

        const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
        expect(commentDetails).toEqual([
          new DetailComment({ ...firstComment, username: 'SomeUser' }),
          new DetailComment({ ...secondComment, username: 'SomeUser' }),
        ]);
      });

      it('should return an empty array when no comments exist for the thread', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );

        const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
        expect(commentDetails).toStrictEqual([]);
      });
    });

    describe('checkCommentIsExist', () => {
      it('should resolve if comment exists', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );

        await expect(commentRepositoryPostgres.checkCommentIsExist({ threadId: 'thread-123', commentId: 'comment-123' }))
          .resolves.not.toThrowError();
      });

      it('should reject if comment does not exist', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );

        await expect(commentRepositoryPostgres.checkCommentIsExist({ threadId: 'thread-123', commentId: 'comment-456' }))
          .rejects.toThrowError('comment yang Anda cari tidak ada');
      });

      it('should reject if comment is already deleted', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          isDeleted: true,
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );

        await expect(commentRepositoryPostgres.checkCommentIsExist({ threadId: 'thread-123', commentId: 'comment-456' }))
          .rejects.toThrowError('comment yang Anda cari tidak ada');
      });
    });

    describe('verifyCommentAccess', () => {
      it('should not throw error if user has authorization', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );
        await expect(commentRepositoryPostgres.verifyCommentAccess({
          commentId: 'comment-123', ownerId: 'user-123',
        })).resolves.toBeUndefined();
      });

      it('should throw error if user has no authorization', async () => {
        await ThreadsTableTestHelper.addThread({ id: 'thread-xyz' });
        await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId: 'thread-123', owner: 'user-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );
        await expect(commentRepositoryPostgres.verifyCommentAccess({
          threadId: 'thread-123', owner: 'user-456',
        })).rejects.toThrowError('proses gagal karena Anda tidak mempunyai akses ke aksi ini');
      });
    });

    describe('checkCommentBelongsToThread', () => {
      it('should not throw error if comment exists in thread', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );
        await expect(commentRepositoryPostgres.checkCommentBelongsToThread({
          threadId: 'thread-123', commentId: 'comment-123',
        })).resolves;
      });

      it('should throw error if comment is not in thread', async () => {
        await ThreadsTableTestHelper.addThread({ id: 'thread-456' });
        await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId: 'thread-456' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {}, {},
        );
        await expect(commentRepositoryPostgres.checkCommentBelongsToThread({
          threadId: 'thread-123', commentId: 'comment-456',
        })).rejects.toThrowError('comment yang anda cari tidak ada di thread ini');
      });
    });
  });
});
