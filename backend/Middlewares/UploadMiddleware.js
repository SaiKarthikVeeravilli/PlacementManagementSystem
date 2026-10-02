const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

filename: (req, file, cb) => {

  const uniqueName =
    Date.now() +
    "-" +
    Math.round(Math.random() * 1E9) +
    path.extname(file.originalname);

  cb(null, uniqueName);
}

});

const fileFilter = (req, file, cb) => {

  const extension =
    path.extname(file.originalname).toLowerCase();

  if (
    extension === ".pdf" &&
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed"),
      false
    );
  }

};

const UploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
module.exports = UploadMiddleware;