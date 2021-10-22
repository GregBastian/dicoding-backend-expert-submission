const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const commentRepositoryPostgres = new LikeRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(LikeRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const firstCommentId = 'comment-123';
      const secondCommentId = 'comment-456';
      await UsersTableTestHelper.addUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: firstCommentId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: secondCommentId, owner: userId });
    });
    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await LikesTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('checkLikeExists function', () => {
      it('checkLikeExists should return true if like exists', async () => {
        await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        const statusCheck = await likeRepositoryPostgres.checkLikeIsExists({ commentId: 'comment-123', owner: 'user-123' });
        expect(statusCheck).toEqual(true);
      });

      it('checkLikeExists should return false if like does not exists', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        const statusCheck = await likeRepositoryPostgres.checkLikeIsExists({ commentId: 'comment-456', owner: 'user-456' });
        expect(statusCheck).toEqual(false);
      });
    });

    describe('addLike function', () => {
      it('addLike function should add database entry for said like', async () => {
        // arrange
        const newLike = new NewLike({
          commentId: 'comment-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';

        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, fakeIdGenerator,
        );

        // action
        const addedLike = await likeRepositoryPostgres.addLike(newLike);
        const like = await LikesTableTestHelper.getLikeByCommentIdAndOwner(newLike);

        // assert
        expect(addedLike).toStrictEqual(({
          id: 'like-123',
        }));
        expect(like).toStrictEqual({
          id: 'like-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        });
      });
    });

    describe('deleteLikeByCommentIdAndOwner function', () => {
      it('deleteLikeByCommentIdAndOwner should not throw error when deleting like', async () => {
        await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        await expect(likeRepositoryPostgres.deleteLikeByCommentIdAndOwner({ commentId: 'comment-123', owner: 'user-123' }))
          .resolves.not.toThrowError();
      });

      it('deleteLikeByCommentIdAndOwner should throw error when deleting non-existing like', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        await expect(likeRepositoryPostgres.deleteLikeByCommentIdAndOwner({ commentId: 'comment-123', owner: 'user-123' }))
          .rejects.toThrowError();
      });
    });

    describe('getLikeCountByCommentId function', () => {
      it('getLikeCountByCommentId function should get right likeCount #1', async () => {
        // arrange
        await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
        );

        // action
        const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

        // asssert
        expect(likeCount).toEqual(1);
      });

      it('getLikeCountByCommentId function should get right likeCount #2', async () => {
        // arrange
        const commentId = 'comment-456';

        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
        );

        // action
        const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId(commentId);

        // asssert
        expect(likeCount).toEqual(0);
      });
    });
  });
});
