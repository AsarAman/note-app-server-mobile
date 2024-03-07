import express from  "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/UsersController.js";
import authenticateUser from "../middlewares/authentication.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update").patch(authenticateUser, updateUser);

export default  router;
