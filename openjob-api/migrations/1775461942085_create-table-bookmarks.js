/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('bookmarks');
};