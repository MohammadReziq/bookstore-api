const mongoose = require("mongoose");
const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  {
    timestamps: true,
  }
);
/**
 * @desc    Validate author input
 * @access  Internal use
 */
function validateAuthor(author) {
  const errors = {};

  if (!author.firstName || author.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }

  if (!author.lastName || author.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  }

  if (!author.nationality || author.nationality.trim().length < 2) {
    errors.nationality = "Nationality is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

const Author = mongoose.model("Author", AuthorSchema);
module.exports = {
  Author,
  validateAuthor,
};
