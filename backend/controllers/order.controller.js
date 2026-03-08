import Order from "../models/Order.model.js";

// Create order
export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress, paymentresult, totalprice, paymentStatus, status  } = req.body;
        const order = new Order({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentresult,
            totalprice,
            paymentStatus,
            status
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders (Admin purpose)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "firstname surname email").populate("items.productId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "firstname surname email")
            .populate("items.productId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin function)
export const updateOrderStatus = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate("items.productId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
