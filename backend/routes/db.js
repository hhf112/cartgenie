import express from 'express';
import { supabase } from '../db.js';
import { createUser, fetchUser } from "../controllers/db.js"

const router = express.Router();

router.post("/create_user",createUser)
router.get("/getUser/:email", fetchUser)



export default router


