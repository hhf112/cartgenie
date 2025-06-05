import express from "express";

export default router= express.Router();

router.post("/promptContent", (req, res) => {
    console.log(req.body);
    res.status(200).send("ok");
}  )

