const { Schema, model } = require("mongoose");

const Feedback = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Excursion = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },
    offeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvalStatus: {
      type: Number,
      default: 0,
      min: 0, // 0 => pending, 1 => approved, 2 => rejected, 3 => fixes needed
      max: 3,
    },
    status: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "https://www.jquery-az.com/html/images/banana.jpg",
    },
    feedback: [{ type: Feedback }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Excursion", Excursion);
