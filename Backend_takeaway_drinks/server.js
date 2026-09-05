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
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
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
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: 'Vui lòng chọn ảnh sản phẩm',
        data: null
      });
    }
    const imagePath = `assets/list-drinks/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO product (name, price, img) VALUES ($1, $2, $3) RETURNING *`,
      [name, price, imagePath]
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
    const { name, price } = req.body;
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
        `UPDATE product SET name = $1, price = $2, img = $3 WHERE id = $4 RETURNING *`,
        [name, price, imagePath, id]
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
    const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Không tìm thấy sản phẩm',
        data: null
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
      message: 'Lỗi xóa sản phẩm',
      data: null
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});