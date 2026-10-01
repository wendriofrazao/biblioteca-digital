import { Router } from "express";
import { authRouter } from "./auth.route.js";
import { categoryRouter } from "./category.route.js";
import { authorRouter } from "./author.route.js";
import { bookRouter } from "./book.route.js";

export const router = Router();

router.get("/", (req, res) => {
    res.json({
        backend: "biblioteca-digital",
        versao: "v1.0.0"
    })
});

router.use("/user", authRouter);
router.use("/category", categoryRouter);
router.use("/author", authorRouter);
router.use("/book", bookRouter);