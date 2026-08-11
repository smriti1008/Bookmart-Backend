const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { AuthenticateToken } = require("./userAuth");

// Add a book to favourites (secure)
router.put("/added-in-favourite", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body; // body se bookId
    const userId = req.user.id; // token se id

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookFavourite = userData.favourites.includes(bookId);
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already added to favourite..." });
    }

    await User.findByIdAndUpdate(userId, { $push: { favourites: bookId } });
    return res.status(200).json({ message: "Book added to favourite..." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// remove book from favourites
router.put("/remove-from-favourite", AuthenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body; // bookId from body
    const id = req.user.id;      // id from token (set in AuthenticateToken)

    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookId);

    if (!isBookFavourite) {
      return res.status(400).json({ message: "Book is not in favourites..." });
    }

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookId } });
    return res.status(200).json({ message: "Book removed from favourites..." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/favourites", AuthenticateToken, async (req, res) => {
  try {
    const id = req.user.id; // id from token

    // Populate favourites with actual book details
    const userData = await User.findById(id).populate("favourites");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Favourite books fetched successfully",
      data: userData.favourites
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


module.exports = router;
