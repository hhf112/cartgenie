import { createClient } from "@supabase/supabase-js";
import pkg from "pg";
import "dotenv/config";


const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
  console.error("url or key not found.");
  process.exit(1);
}
export const supabase = createClient(url, key);

const { Client } = pkg;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

export const pg = new Client(dbConfig);




