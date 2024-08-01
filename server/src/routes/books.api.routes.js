// const express = require('express');
// const { Book } = require('../../db/models');

// const router = express.Router();

// router
//   .route('/')
//   .get(async (req, res) => {
//     try {
//       const books = await Book.findAll({ order: [['id', 'DESC']] });
//       res.json(books);
//     } catch (error) {
//       console.log(error);
//       res.sendStatus(500);
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const newBook = await Book.create(req.body);
//       res.json(newBook);
//     } catch (error) {
//       console.error(error);
//       res.sendStatus(500);
//     }
//   });

// router
//   .route('/:id')
//   .delete(async (req, res) => {
//     try {
//       await Book.destroy({ where: { id: req.params.id } });
//       res.sendStatus(200);
//     } catch (err) {
//       console.error(err);
//       res.sendStatus(500);
//     }
//   })
//   .patch(async (req, res) => {
//     try {
//       await Book.update(req.body, { where: { id: req.params.id } });
//       const book = await Book.findByPk(req.params.id);
//       res.json(book);
//     } catch (err) {
//       console.error(err);
//       res.sendStatus(500);
//     }
//   });

// module.exports = router;
