import Todos from "../models/Note.js";
import httpStatusCodes from "http-status-codes";

import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";

import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  const { title, description, category, dueDate, image } = req.body;
  console.log(image, "image");

  if (!title || !description || !category) {
    throw new BadRequestError("Please provide all values");
  }
  let uplaodImage;
  if (image) {
    uplaodImage = await cloudinary.uploader.upload(image, {
      upload_preset: "blogWebsite",
    });
    console.log("upload", uplaodImage);
  }
  const todo = await Todos.create({
    title,
    description,
    category,
    dueDate: dueDate,
    image: uplaodImage.secure_url,

    createdBy: req.user.userId,
  });

  res.status(httpStatusCodes.CREATED).json({ todo });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, dueDate, image, bookMark } = req.body;
  if (bookMark) {
    const findTask = await Todos.findOne({ _id: id });
    if (findTask) {
      const newBookmarkValue = !findTask.bookMark; // Toggle the bookmark value
      const updatedTask = await Todos.findOneAndUpdate(
        { _id: id, createdBy: req.user.userId },
        { $set: { bookMark: newBookmarkValue } },
        { new: true, runValidators: true }
      );

      console.log(bookMark, "bookmark");
      return res.json({ data: bookMark, item: updatedTask });
    }

    return;
  }

  if ((!title, !description, !category)) {
    throw new BadRequestError("Please provide all required values!");
  }

  console.log(title, description, category, dueDate);

  const findTask = await Todos.findById({ _id: id });

  if (!findTask) {
    throw new NotFoundError(`Task not found with id ${id}`);
  }
  let uplaodImage;
  if (image) {
    uplaodImage = await cloudinary.uploader.upload(image, {
      upload_preset: "blogWebsite",
    });
    console.log("upload", uplaodImage);
  }

  findTask.title = title;
  findTask.description = description;
  findTask.category = category;
  findTask.dueDate = dueDate;
  findTask.image = uplaodImage.secure_url;
  findTask.createdBy = req.user.userId;

  await findTask.save();
  res
    .status(httpStatusCodes.OK)
    .json({ findTask, msg: "Note updated successfully!" });
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

  categories.unshift("all");

  console.log(categories, "categories");
  res.status(httpStatusCodes.OK).json({ categories, msg: "Your categories" });
};

export { getTodos, createTodo, updateTodo, deleteTodo, getCategories };
