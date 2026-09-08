exports.up = (pgm) => {
  pgm.createTable('order_details', {
    id: {
      type: 'serial',
      primaryKey: true,
    },

    order_id: {
      type: 'integer',
      notNull: true,
      references: 'orders',
      onDelete: 'CASCADE',
    },

    product_id: {
      type: 'integer',
      references: 'product',
      onDelete: 'SET NULL',
    },

    product_name: {
      type: 'varchar(255)',
      notNull: true,
    },

    price: {
      type: 'numeric(12, 2)',
      notNull: true,
    },

    quantity: {
      type: 'integer',
      notNull: true,
    },

    subtotal: {
      type: 'numeric(12, 2)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('order_details');
};