/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    job_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    experience_level: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location_city: {
      type: 'TEXT',
      notNull: true,
    },
    salary_min: {
      type: 'INTEGER',
      notNull: true,
    },
    salary_max: {
      type: 'INTEGER',
      notNull: true,
    },
    is_salary_visible: {
      type: 'BOOLEAN',
      notNull: true,
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('jobs');
};