const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const record = await this.getLikeById(newLike);
    const { commentId, owner } = newLike;
    let query;

    if (!record) {
      const id = `like-${this._idGenerator(10)}`;

      query = {
        text: 'INSERT INTO likes (id, comment_id, owner) VALUES ($1, $2, $3) RETURNING 1 AS INDEX, id',
        values: [id, commentId, owner],
      };
    } else {
      query = {
        text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2 RETURNING -1 as INDEX, id',
        values: [commentId, owner],
      };
    }

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeById({ commentId, owner }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }
}

module.exports = LikeRepositoryPostgres;
