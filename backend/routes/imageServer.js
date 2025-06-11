import express from 'express';
import multer from 'multer';

import { search } from "../controllers/genResult.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post('/upload', upload.array("images"), imageUpload);
router.post('/upload', upload.array("images"), search);
router.post('/uploadtext', search);

export default router;

