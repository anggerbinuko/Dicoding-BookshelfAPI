const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const bookId = nanoid(16);
  const isFinished = pageCount === readPage;
  const timestamp = new Date().toISOString();

  const newBook = {
    id: bookId, name, year, author, summary, publisher,
    pageCount, readPage, reading, finished: isFinished,
    insertedAt: timestamp, updatedAt: timestamp,
  };

  books.push(newBook);

  const success = books.filter((book) => book.id === bookId).length > 0;

  if (success) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;
  let filteredBooks = books;

  if (name) {
    const regex = new RegExp(name, 'gi');
    filteredBooks = filteredBooks.filter((book) => regex.test(book.name));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = books.find((book) => book.id === bookId);

  if (book) {
    return h.response({
      status: 'success',
      data: { book },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const updateBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher,
      pageCount, readPage, reading, finished, updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const removeBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  removeBookByIdHandler,
};
