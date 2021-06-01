const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const mkdirp = require("mkdirp");

// Setup file storage strategy
const storage = multer.diskStorage({
  // destination: path.resolve(__dirname, '.', 'uploads'),
  // destination: 'uploads/listingimages',
  destination: (req, file, cb) => {
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "uploads",

      "webpieces"
    );
    const made = mkdirp.sync(uploadDir);
    const madeResized = mkdirp.sync(`${uploadDir}/resized`);
    console.log(`made directories, starting with ${made}`);

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // cb(null, `${file.originalname}`); // (error, filename)
    cb(null, `${Date.now()}.jpeg`); // (error, filename)
  }
});

const upload = multer({ storage });

const router = Router();

const webpieceController = require("../controllers/webpieceController");

router.get("/", webpieceController.getAllWebpieceRequests);
router.post("/", webpieceController.addWebpieceRequest);
router.post(
  "/images",
  upload.single("webpieceImage"),
  webpieceController.addWebpieceRequestImage
);
router.delete("/:id", webpieceController.deleteWebpieceRequest);
router.patch("/:id", webpieceController.updateWebpieceRequest);

module.exports = router;
