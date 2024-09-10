const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name, year, author, summary, publisher,
    pageCount, readPage, finished, reading, id,
    insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
  }

  return res.status(500).json({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  if (name) {
    const nameRegex = new RegExp(name, 'gi');
    filteredBooks = filteredBooks.filter((book) => nameRegex.test(book.name));
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
};

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((n) => n.id === bookId);

  if (book) {
    return res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
};

const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author,
      summary, publisher, pageCount, readPage,
      reading, finished, updatedAt,
    };

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
};

const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
