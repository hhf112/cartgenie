import { supabase } from "../db.js"
import { pg } from '../db.js';
import "dotenv/config.js"

export const search = async (req, res) => {
  const data = new FormData();
  if (req.file) data.append("images", req.file);
  if (req.files) {
    for (const img of req.files) {
      data.append("images", img);
    }
  }
  if (req.body.text) data.append("text", req.body.text);

  let embedding;
  try {
    const resp = await fetch(`${process.env.HUGGINGFACE_URL}/upload`, {
      method: "POST",
      body: data
    })

    embedding = await resp.json()
  } catch (err) {
    res.status(500).json({
      "huggingFace": err,
      "error": "failed to generate embeddings"
    })
  }

  try {
    let product = await pg.query(`SELECT category FROM labels ORDER BY embedding <-> '[${embedding}]' LIMIT 1;`);
    product = product.rows[0].category;

    let category = await pg.query(`SELECT category FROM ${product} ORDER BY embedding <-> '[${embedding}]' LIMIT 1;`)
    category = category.rows[0].category;

    const result = await pg.query(`SELECT url, caption, product_url FROM products WHERE label = ${category} ORDER BY embedding <-> '[${embedding}]' LIMIT 5;`);
    res.status(200).json(result)
    console.log("request served")
  } catch (error) {
    console.log(error);
    res.status(500).send("request failed")
  }
};

