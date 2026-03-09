import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    },
  phoneNumber: {
    type: String,
    required: true,
    },
  isDefault: {
    type: Boolean,
    default: false,
    },
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  surname: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
      type: String,
    },
    address: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
      
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
