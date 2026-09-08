exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: {
      type: 'serial',
      primaryKey: true,
    },

    order_code: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },

    total_amount: {
      type: 'numeric(12, 2)',
      notNull: true,
      default: 0,
    },

    status: {
      type: 'varchar(30)',
      notNull: true,
      default: 'completed',
    },

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('orders');
};