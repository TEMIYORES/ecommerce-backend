import path from "path";

const fileExtLimiter = (allowedArray) => {
  return (req, res, next) => {
    const files = req.files;
    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });
    // Are the file extensions allowed?
    const allowed = fileExtensions.every((ext) => allowedArray.includes(ext));
    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedArray.toString()} files allowed.`.replaceAll(
          ",",
          ", "
        );
      return res.status(422).json({ status: "error", message }); //cannot process file
    }
    next();
  };
};

export default fileExtLimiter;
