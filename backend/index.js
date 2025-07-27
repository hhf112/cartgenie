import cors from 'cors';
import "dotenv/config"
import express from 'express';
import FormData from 'form-data';
import multer from "multer";
import axios from 'axios';

import { supabase } from "./db.js"
import { pg } from "./db.js";

const app = express();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


try {
  pg.connect();
} catch (err) {
  console.log("database failed: ", err)
  process.exit(1);
}

const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).json({status: "working"});
})

app.post('/upload', upload.single('images'), async function(req, res, next) {
  try {
    const form = new FormData();
    form.append("images", req.file);
    form.append("text", req.body.text);
    form.append("session", req.body.session);

    const response = await axios.post(`${process.env.EMBEDADDR}/upload`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const embedding = response.data;

    const result = await pg.query(`SELECT url, caption, product_url FROM products ORDER BY noindex <-> '[${embedding}]' LIMIT 5;`);

    // console.log(embedding);
    // console.log(result);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error." });
  }
})

app.listen(PORT, () => {
  console.log(PORT);
});
