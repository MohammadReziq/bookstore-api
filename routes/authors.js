const express = require("express");
const router = express.Router();
const { Author, validateAuthor } = require("../models/Author");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
router.use(express.json());

/**
 * @desc    Get all authors
 * @route   GET /api/authors
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    //   .sort({ firstName: 1 })
    //   .select("firstName lastName -_id");
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @desc    Get single author by ID
 * @route   GET /api/authors/:id
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: "id not found" });
  }
});

/**
 * @desc    Create a new author
 * @route   POST /api/authors
 * @access  private (only admin)
 */
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const validationErrors = validateAuthor(req.body);
  if (validationErrors) return res.status(400).json(validationErrors);

  try {
    const newAuthor = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image, // ممكن تنشال لو بدك تعتمد على القيمة الافتراضية
    });

    const result = await newAuthor.save();

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/**
 * @desc    Update an existing author
 * @route   PUT /api/authors/:id
 * @access  Public
 */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const validationErrors = validateAuthor(req.body);
  if (validationErrors) return res.status(400).json(validationErrors);

  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.images,
        },
      },
      { new: true }
    );

    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "not found id" });
  }
});

/**
 * @desc    Delete an author by ID
 * @route   DELETE /api/authors/:id
 * @access  Public
 */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const authorId = req.params.id;

  try {
    const author = await Author.findById(authorId);

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    await Author.findByIdAndDelete(authorId);

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Delete Author Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
});

module.exports = router;
