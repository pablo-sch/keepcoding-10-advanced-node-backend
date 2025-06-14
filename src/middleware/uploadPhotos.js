import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ruta = path.join(import.meta.dirname, "..", "..", "public", "photos");
    cb(null, ruta);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const id = randomUUID();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}-${id}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;
