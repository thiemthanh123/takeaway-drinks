exports.up = (pgm) => {
  pgm.alterColumn('orders', 'status', {
    default: 'pending',
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('orders', 'status', {
    default: 'completed',
  });
};