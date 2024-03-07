import express from "express";
const router = express.Router();
import  {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/notesController.js';

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").patch(updateTodo).delete(deleteTodo);

export default  router;
