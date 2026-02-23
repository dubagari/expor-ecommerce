import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: true
    },

    // short_description: { type: String, required: true },

    // brand: { type: String, required: true },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    category: {
      type: String,
      required: true
    },

    image: [{
      type: String,
      required: true
    }],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // reviews: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Review",
    //   },
    // ],
    // userRef: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
