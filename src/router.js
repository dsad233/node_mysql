import express from "express";
import postsRouter from "../src/posts/posts.router.js";
import authRouter from "./auth/auth.router.js";
import usersRouter from "./users/users.router.js";
const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

export default router;