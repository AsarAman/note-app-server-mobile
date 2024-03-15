import express from "express";
const router = express.Router();
import  {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getCategories
} from '../controllers/notesController.js';

router.route("/").get(getTodos).post(createTodo);
router.route('/categories').get(getCategories)
router.route("/:id").patch(updateTodo).delete(deleteTodo);

export default  router;
