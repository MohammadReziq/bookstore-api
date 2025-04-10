const express = require("express");
const router = express.Router();
const { validateBook, Book } = require("../models/Book");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
// Get all books
router.get("/", async (req, res) => {
  const books = await Book.find().populate("author", ["firstName", "lastName"]);
  res.json(books);
});

// Get book by ID
router.get("/:id", async (req, res, next) => {
  try {
    const singleBook = await Book.findById(req.params.id).populate("author");

    if (!singleBook) {
      // بس نرمي الخطأ بدون ما نكتب رسالة
      throw new Error(); // أو: next(new Error())
    }

    res.status(200).json(singleBook);
  } catch (error) {
    next(error); // 🔥 بيبعته للـ error middleware مباشرة
  }
});

// Add a new book
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const resultValidate = validateBook(req.body);
    if (resultValidate) {
      return res.status(400).json({ error: resultValidate });
    }

    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Update a book
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const result = validateBook(req.body);

    if (result) {
      return res.status(400).json({ error: result });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
//67f6ba08b1b39f37f1fb6ccb
// Delete a book
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
