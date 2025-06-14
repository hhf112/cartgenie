import cors from 'cors';
import fs from "fs"
import "dotenv/config"
import express from 'express';
import FormData from "form-data";
import fetch from "node-fetch"

import { supabase } from "./db.js"
import { pg } from "./db.js";
const app = express();


try {
  pg.connect();
} catch (err) {
  console.log("database failed: ", error)
  process.exit(1);
}

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const search = async (req, res) => {
  try {
    const embedding = req.body.embeddings;
    
    const result = await pg.query(`SELECT url, caption, product_url FROM products ORDER BY noindex <-> '[${embedding}]' LIMIT 5;`);


    res.status(200).json(result)
    console.log("request served")
  } catch (error) {
    console.log(error);
    res.status(500).send("request failed")
  }
};

app.get('/', (req, res) => {
  res.status(200).send("working")
})

app.post('/upload', search);


app.listen(PORT, () => {
  console.log(PORT);
});
