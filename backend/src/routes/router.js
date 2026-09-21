import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
    res.json({
        backend: "biblioteca-digital",
        versao: "v1.0.0"
    })
});