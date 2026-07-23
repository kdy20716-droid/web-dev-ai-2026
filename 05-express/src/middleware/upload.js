import multer from "multer";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();

  const stream = cloudinary.uploader.upload_stream(
    { folder: "cocktail" },
    (error, result) => {
      if (error) return next(error);
      req.file.cloudinaryUrl = result.secure_url;
      req.file.cloudinaryPublicId = result.public_id;
      next();
    }
  );

  Readable.from(req.file.buffer).pipe(stream);
};

export default upload;
