import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

// Overall Dashboard Stats for Admin
export const getDashboardStats = async (req, res) => {
    try {
        const customersCount = await User.countDocuments();
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        
        const revenue = await Order.aggregate([
            {
                $match: { paymentStatus: 'paid' } // and maybe status: 'delivered' or 'processing'
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        
        res.status(200).json({
            customers: customersCount,
            products: productsCount,
            orders: ordersCount,
            revenue: revenue[0]?.totalRevenue || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin specific list of all customers
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
