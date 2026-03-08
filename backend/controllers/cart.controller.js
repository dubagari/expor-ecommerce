import Cart from "../models/Cart.model.js";

// Create or update cart for user
export const createCart = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is missing or empty" });
        }
        const { userId, items } = req.body;
        
        if (!userId || !items) {
             return res.status(400).json({ message: "userId and items are required" });
        }

        // Check if cart already exists for this user
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = items;
            await cart.save();
        } else {
            cart = new Cart({ userId, items });
            await cart.save();
        }
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get cart for user
export const getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId", "name price category image");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update cart items (like changing quantity or removing something)
export const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { items: req.body.items },
            { new: true }
        ).populate("items.productId", "name price category image");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete cart object
export const deleteCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
