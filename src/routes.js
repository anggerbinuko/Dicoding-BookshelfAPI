const express = require('express');
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const router = express.Router();

// POST /books - Menambahkan buku
router.post('/books', addBookHandler);

// GET /books - Mendapatkan semua buku
router.get('/books', getAllBooksHandler);

// GET /books/:bookId - Mendapatkan buku berdasarkan ID
router.get('/books/:bookId', getBookByIdHandler);

// PUT /books/:bookId - Mengedit buku berdasarkan ID
router.put('/books/:bookId', editBookByIdHandler);

// DELETE /books/:bookId - Menghapus buku berdasarkan ID
router.delete('/books/:bookId', deleteBookByIdHandler);

module.exports = router;
