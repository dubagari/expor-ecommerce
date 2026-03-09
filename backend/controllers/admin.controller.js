import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

// Overall Dashboard Stats for Admin
export const getDashboardStats = async (req, res) => {
    try {
        const customersCount = await User.countDocuments();
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        
        const revenueData = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);

        // Calculate Top Selling Product
        const topSellingData = await Order.aggregate([
            { $unwind: "$products" },
            { $group: { 
                _id: "$products.productId", 
                totalQuantity: { $sum: "$products.quantity" } 
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 },
            { $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }},
            { $unwind: "$productInfo" }
        ]);

        const topProduct = topSellingData[0] ? {
            name: topSellingData[0].productInfo.name,
            price: topSellingData[0].productInfo.price
        } : null;

        // Calculate Next Payout (Paid but not yet delivered/withdrawn - simplified logic)
        const payoutData = await Order.aggregate([
            { $match: { paymentStatus: 'paid', status: { $ne: 'Delivered' } } },
            { $group: { _id: null, amount: { $sum: '$totalAmount' } } }
        ]);
        
        res.status(200).json({
            customers: customersCount,
            products: productsCount,
            orders: ordersCount,
            revenue: revenueData[0]?.totalRevenue || 0,
            topProduct: topProduct || { name: "No Sales Yet", price: 0 },
            nextPayout: payoutData[0]?.amount || 0
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
