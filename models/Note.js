import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Provide Name"],
    },
    description: {
      type: String,
      required: [true, "Please Provide Description"],
    },
    category:{
      type: String,
      required: [true, 'Please provide category']

    },
    createdBy:{
      type: mongoose.Types.ObjectId,
      ref:'Users',
      required:[true, 'please provide user']
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notes", NoteSchema);
