const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));

const uploadDir = path.join(__dirname, 'Backend_takeaway_drinks', '..', 'src', 'assets', 'list-drinks');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '_' + file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product ORDER BY id');
    const products = result.rows.map(product => ({
      ...product,
      img: product.img ? `http://localhost:${PORT}/${product.img}` : null
    }));
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi lấy danh sách sản phẩm',
      data: null
    });
  }
});

// GET PRODUCT BY ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Không tìm thấy sản phẩm',
        data: null
      });
    }
    const product = {
      ...result.rows[0],
      img: result.rows[0].img ? `http://localhost:${PORT}/${result.rows[0].img}` : null
    };
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi lấy sản phẩm',
      data: null
    });
  }
});

// CREATE PRODUCT
app.post('/api/products', upload.single('img'), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: 'Vui lòng chọn ảnh sản phẩm',
        data: null
      });
    }
    const imagePath = `assets/list-drinks/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO product (name, price, img, category) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, price, imagePath, category]
    );
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi tạo sản phẩm',
      data: null
    });
  }
});

// UPDATE PRODUCT
app.put('/api/products/:id', upload.single('img'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const oldProduct = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
    if (oldProduct.rows.length === 0) {
      if (req.file) {
        fs.unlink(path.join(__dirname, 'src', 'assets/list-drinks', req.file.filename), () => { });
      }
      return res.status(404).json({
        status: 404,
        message: 'Không tìm thấy sản phẩm',
        data: null
      });
    }
    const imagePath = req.file
      ? `assets/list-drinks/${req.file.filename}`
      : oldProduct.rows[0].img;
    let result;
    try {
      result = await pool.query(
        `UPDATE product SET name = $1, price = $2, category = $3, img = $4 WHERE id = $5 RETURNING *`,
        [name, price, category, imagePath, id]
      );
    } catch (error) {
      if (req.file) {
        fs.unlink(path.join(__dirname, 'src', 'assets/list-drinks', req.file.filename), () => { });
      }
      throw error;
    }
    if (req.file && oldProduct.rows[0].img) {
      fs.unlink(path.join(__dirname, 'src', oldProduct.rows[0].img), (err) => {
        if (err) console.error('Lỗi xóa ảnh cũ:', err);
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi cập nhật sản phẩm',
      data: null
    });
  }
});

// DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productResult = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Không tìm thấy sản phẩm',
        data: null
      });
    }
    const product = productResult.rows[0];
    const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0 && product.img) {
      const imagePath = path.join(__dirname, 'src', 'assets', 'list-drinks', path.basename(product.img));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi xóa sản phẩm',
      data: null
    });
  }
});

// CREATE ORDER
app.post('/api/orders', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: 400,
      message: 'Đơn hàng phải có ít nhất một sản phẩm',
      data: null
    });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const productIds = items.map(item => Number(item.product_id));
    const productResult = await client.query(
      'SELECT id, name, price, img, category FROM product WHERE id = ANY($1::int[])',
      [productIds]
    );
    const products = new Map(
      productResult.rows.map(product => [product.id, product])
    );
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('Số lượng sản phẩm không hợp lệ');
      }
      const product = products.get(productId);
      if (!product) {
        throw new Error(`Không tìm thấy sản phẩm có id ${productId}`);
      }
      const price = Number(product.price);
      const subtotal = price * quantity;
      totalAmount += subtotal;
      orderItems.push({
        productId,
        productName: product.name,
        price,
        quantity,
        subtotal
      });
    }
    const orderCode = `ORD-${Date.now()}`;
    const orderResult = await client.query(
      `INSERT INTO orders (order_code, total_amount, status)
             VALUES ($1, $2, $3)
             RETURNING id, order_code, total_amount, status, created_at`,
      [orderCode, totalAmount, 'pending']
    );
    const order = orderResult.rows[0];
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_details
                (order_id, product_id, product_name, price, quantity, subtotal)
                VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.subtotal
        ]
      );
    }
    await client.query('COMMIT');
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: order
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message || 'Lỗi tạo đơn hàng',
      data: null
    });
  } finally {
    client.release();
  }
});

// GET ALL ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, order_code, total_amount, status, created_at
             FROM orders
             ORDER BY created_at DESC`
    );
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi lấy danh sách đơn hàng',
      data: null
    });
  }
});

// GET ORDER BY ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderResult = await pool.query(
      `SELECT id, order_code, total_amount, status, created_at
             FROM orders
             WHERE id = $1`,
      [id]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Không tìm thấy đơn hàng',
        data: null
      });
    }
    const order = orderResult.rows[0];
    const detailResult = await pool.query(
      `SELECT
                od.id,
                od.product_id,
                od.product_name,
                od.price,
                od.quantity,
                od.subtotal,
                p.img,
                p.category
             FROM order_details od
             LEFT JOIN product p ON p.id = od.product_id
             WHERE od.order_id = $1
             ORDER BY od.id`,
      [id]
    );
    const items = detailResult.rows.map(item => ({
      ...item,
      img: item.img ? `http://localhost:${PORT}/${item.img}` : null
    }));
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: {
        ...order,
        items
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi lấy chi tiết đơn hàng',
      data: null
    });
  }
});

// UPDATE ORDER STATUS
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = [
      'pending',
      'preparing',
      'completed',
      'cancelled'
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 400,
        message: 'Trạng thái đơn hàng không hợp lệ',
        data: null
      });
    }
    const currentResult = await pool.query(
      'SELECT id, status FROM orders WHERE id = $1',
      [id]
    );
    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Không tìm thấy đơn hàng',
        data: null
      });
    }
    const currentStatus = currentResult.rows[0].status;
    const validTransitions = {
      pending: ['preparing', 'cancelled'],
      preparing: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };
    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        status: 400,
        message: `Không thể chuyển trạng thái từ ${currentStatus} sang ${status}`,
        data: null
      });
    }
    const result = await pool.query(
      `UPDATE orders
             SET status = $1
             WHERE id = $2
             RETURNING id, order_code, total_amount, status, created_at`,
      [status, id]
    );
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Lỗi cập nhật trạng thái đơn hàng',
      data: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});