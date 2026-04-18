/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable('applications', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'cascade',
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'pending'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('applications');
};