import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    image: {
        type: String,
        required: true,
    },
})

const shippingAddressSchema = new mongoose.Schema({
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
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: shippingAddressSchema,
        required: true,
    },
    paymentresult: {
        id: String,
        status: String ,
    },
    totalprice: {
        type: Number,
        required: true,
        min: 0
    },

    paymentStatus: {
        type: String,
        required: true,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    deliveredAt: {
        type: Date,
    },
    shippedAt: {
        type: Date,
    },
}, {
    timestamps: true
})

export default mongoose.model("Order", orderSchema);
