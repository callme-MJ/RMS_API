import { diskStorage } from "multer";
import { extname } from "path";
import { fileURLToPath } from "url";

export const storage = diskStorage({ 
    destination: "./public/uploads",
    filename: (req, file, callback) => {
      callback(null, generateFilename(file));
    }
  });
  
  function generateFilename(file) {
    return `${Date.now()}.${extname(file.originalname)}`;
  }