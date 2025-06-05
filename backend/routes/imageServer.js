import express from 'express';
import multer from 'multer';

import { imageUpload, deleteImage } from '../controllers/imageDb.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single("images"), imageUpload);
router.post('/deleteImage', deleteImage);

export default router;

