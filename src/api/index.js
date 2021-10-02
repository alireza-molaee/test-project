import express from "express";
import userRoutes from "./user";
import productRouts from './products';

const router = express.Router();

router.use("/user", userRoutes);
router.use("/product", productRouts);

export default router;
