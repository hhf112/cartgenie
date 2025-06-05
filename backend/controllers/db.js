import { supabase } from "../db.js";

export const createUser = async (req, res) => {
  const user = req.body;
  const { data, error } = await supabase
    .from('users')
    .insert([
      { username: user.username, email: user.credential.email },
    ])
    .select()

  if (error) {
    console.log(error);
    res.status(500).send("failed to sign up")
  }
  else {
    console.log("new sign up!", data);
    res.status(200).send("created new user")
  }
}

export const fetchUser = async (req, res) => {
  let { data: users, error } = await supabase
    .from('users')
    .select('username')
    .eq("email", req.params.email)

  if (error) {
    console.log(error)
    res.status(500).send("fetch failed")
  }
  else {
    console.log(users)
    res.status(200).json({username: users})
  }
}
