exports.up = (pgm) => {
  pgm.createTable('product', {
    id: {
      type: 'serial',
      primaryKey: true,
    },

    name: {
      type: 'varchar(255)',
      notNull: true,
    },

    price: {
      type: 'numeric(12, 2)',
      notNull: true,
    },

    img: {
      type: 'text',
    },

    category: {
      type: 'varchar(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('product');
};