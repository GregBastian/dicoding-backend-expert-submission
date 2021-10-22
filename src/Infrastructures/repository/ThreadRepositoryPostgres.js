const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addThread(newThread) {
    const {
      title, body, owner,
    } = newThread;
    const id = `thread-${this._idGenerator(10)}`;
    const date = new this._dateGenerator().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
              FROM threads 
              INNER JOIN users ON threads.owner = users.ID
              WHERE threads.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async getRepliesByThreadId(id) {
    const query = {
      text: `SELECT replies.id, comments.id AS comment_id, 
              replies.is_deleted, replies.content, 
              replies.date, users.username 
              FROM replies 
              INNER JOIN comments ON replies.comment_id = comments.id
              INNER JOIN users ON replies.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY date ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.map((entry) => new DetailReply({
      ...entry, commentId: entry.comment_id, isDeleted: entry.is_deleted,
    }));
  }
}

module.exports = ThreadRepositoryPostgres;
