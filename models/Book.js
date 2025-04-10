const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 250,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("book", bookSchema);
function validateBook(book) {
  const errors = {};

  if ("title" in book && (!book.title || book.title.trim().length < 3)) {
    errors.title = "Title must be at least 3 characters long.";
  }

  if (
    book.author != undefined &&
    (!book.author || book.author.trim().length < 3)
  ) {
    errors.author = "Author must be at least 3 characters long.";
  }

  if (
    "description" in book &&
    (!book.description || book.description.trim().length < 10)
  ) {
    errors.description = "Description must be at least 10 characters.";
  }

  if ("price" in book && (book.price === undefined || isNaN(book.price))) {
    errors.price = "Price must be a number.";
  }

  if (
    ("cover" in book && (!book.cover || book.cover.trim().length < 4)) ||
    (book.cover !== "soft cover" && book.cover !== "hard cover")
  ) {
    errors.cover =
      "Cover must be a valid string and value is 'hard copy' or 'sofy copy'";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

module.exports = { Book, validateBook };
