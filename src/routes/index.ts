import express from "express";
import uploadRoute from "./upload";
import evaluateRoute from "./evaluate";
import resultRoute from "./result";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the CV Evaluation API" });
});

router.use(uploadRoute);
router.use(evaluateRoute);
router.use(resultRoute);

export default router;
