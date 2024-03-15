import Todos from "../models/Note.js";
import httpStatusCodes from "http-status-codes";

import BadRequestError from "../errors/bad-request.js";

const getTodos = async (req, res) => {
  console.log("query", req.query);
  console.log(req.user);
  const { sort, category, search } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (category && category !== "all") {
    queryObject.category = category;
  }
  if (search) {
    queryObject.title = { $regex: search, $options: "i" };
  }

  let result = Todos.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "name-a") {
    result = result.sort("title");
  }
  if (sort === "name-z") {
    result = result.sort("-title");
  }
  const notes = await result;
  //console.log("result", notes);
  // const notes = await Todos.find({ createdBy: req.user.userId });
  res
    .status(httpStatusCodes.OK)
    .json({ notes, amount: notes.length, user: req.user });
};

const createTodo = async (req, res) => {
  console.log("create note", req.body);
  const { title, description, category, dueDate } = req.body;
  console.log(dueDate);

  if (!title || !description || !category) {
    throw new BadRequestError("Please provide all values");
  }
  const todo = await Todos.create({
    title,
    description,
    category,
    dueDate: dueDate,

    createdBy: req.user.userId,
  });

  res.status(httpStatusCodes.CREATED).json({ todo });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;

  //if (!name || !description){
  //  return res.status(400).send("please provide all values");
  //}

  const task = await Todos.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!task) {
    return res
      .status(httpStatusCodes.NOT_FOUND)
      .json({ msg: `no item with id ${id}`, success: false });
  }
  res
    .status(httpStatusCodes.OK)
    .json({ task, msg: "Note updated successfully!" });
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const task = await Todos.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });
  if (!task) {
    return res
      .status(httpStatusCodes.NOT_FOUND)
      .json({ msg: `no item with id ${id}`, success: false });
  }
  res.status(httpStatusCodes.OK).json({ task, msg: "Item deleted!" });
};

const getCategories = async (req, res) => {
  const notes = await Todos.find();
  console.log(notes, "notes");
  let categories = [];

  notes.map((note) => {
    if (categories.includes(note.category)) {
      return;
    } else {
      categories.push(note.category);
    }
  });

  console.log(categories, "categories");
  res.status(httpStatusCodes.OK).json({ categories, msg: "Your categories" });
 
};

export { getTodos, createTodo, updateTodo, deleteTodo, getCategories };
