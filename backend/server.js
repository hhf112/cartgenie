import "dotenv/config"
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { pg } from "./db.js";

// Routers
import imageServer from './routes/imageServer.js';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use('/', imageServer);

try {
  pg.connect();
} catch (err) {
  console.log("pgvector failed: ", error)
}

app.listen(PORT, () => {
  console.log(PORT);
});
