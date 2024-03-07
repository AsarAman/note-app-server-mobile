import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validatorPkg from "validator";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 17,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validatorPkg.isEmail,
        message: "please provide valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
    },
    picture:{
      type:String
    }
  },
  { timestamps: true }
);
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isValid = await bcrypt.compare(userPassword, this.password);
  return isValid;
};

UserSchema.methods.assignJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};
export default mongoose.model("Users", UserSchema);
