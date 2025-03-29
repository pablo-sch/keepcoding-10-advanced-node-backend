import multer from 'multer'
import path from 'path'

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => { // Defines the folder where the file will be saved
    cb(null, 'public/images/'); // Path where the images will be saved
  },
  filename: (req, file, cb) => { // Defines how the file will be named
    cb(null, Date.now() + path.extname(file.originalname)); // generates a unique name based on the current time and retains the original file extension
  }
});

// Create Multer middleware
const upload = multer({ storage })

// Exporting `upload` middleware
export { upload }