/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(18)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(15)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint('likes', 'fk_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('likes', 'fk_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.comment_id_comments.id');
  pgm.dropConstraint('likes', 'fk_likes.owner_users.id');
  pgm.dropTable('likes');
};
