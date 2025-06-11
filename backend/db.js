import { createClient } from "@supabase/supabase-js";
import pkg from "pg";
import "dotenv/config";


export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const { Client } = pkg;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

export const pg = new Client(dbConfig);




