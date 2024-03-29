import User from "../models/User.js";
import UnauthenticatedError from "../errors/UnauthenticateError.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  //check for headers

  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication failed");
  }

  const token = authHeader.split(" ")[1];
  console.log(token)
  

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach user to the todos routes
    
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication failed");
  }
};

export default auth;
