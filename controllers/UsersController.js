import User from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/UnauthenticateError.js";
import httpStatusCodes from "http-status-codes";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    throw new BadRequestError("Please provide all values");
  }
  const person = await User.create({ name, email, password });
  const token = person.assignJWT();

  res.status(httpStatusCodes.CREATED).json({
    sucess: true,
    user: {
      name: person.name,
      email: person.email,
      id: person._id,
      token: token,
    },
    message: "User successfully registered!",
  });
};

const loginUser = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = user.assignJWT();

  res.status(httpStatusCodes.OK).json({
    sucess: true,
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
      profile: user.picture,
      token: token,
    },
    message: "User successfully Logged In!",
  });
};

const updateUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please prvide required fields!");
  }
  const findUser = await User.findOne({ _id: req.user.userId });
  let uplaodImage;
  if (picture) {
    uplaodImage = await cloudinary.uploader.upload(picture, {
      upload_preset: "blogWebsite",
    });
    console.log("upload", uplaodImage);
  }
  findUser.name = name;
  findUser.email = email;
  findUser.password = password;
  findUser.picture = uplaodImage.secure_url;

  await findUser.save();
  const token = findUser.assignJWT();
  res.status(httpStatusCodes.OK).json({
    sucess: true,
    user: {
      name: findUser.name,
      email: findUser.email,
      id: findUser._id,
      profile: findUser.picture,
      token: token,
    },
    message: "User successfully updated!",
  });
};

export{
  registerUser,
  loginUser,
  updateUser,
};


