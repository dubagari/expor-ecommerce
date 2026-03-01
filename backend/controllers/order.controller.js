import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import ReviewsModel from "../models/Reviews.model.js";
export const createOrder = async (req, res) => {
    try {

        const user = req.user

        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

        if (!orderItems || !shippingAddress || !paymentMethod || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items are required' })
        }
        
        for(const item of orderItems){
            const product = await Product.findById(item.product._id)
            if(!product){
                return res.status(404).json({ message: 'Product not found' })
            }
            if(item.quantity > product.stock){
                return res.status(400).json({ message: 'Not enough stock' })
            }
        }

        const order = await Order.create({
            user,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })

        for(const item of orderItems){
            const product = await Product.findByIdAndUpdate(item.product._id,
              {$inc: { stock: - item.quantity }},
                { new: true }
            )
           
        }

        return res.status(201).json({ message: 'Order created successfully', order })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
        .populate("orderItems.product")
            .sort({ createdAt: -1 })
        
        const orderswithreviews = await Promise.all(
            orders.map(async (order) => {
                const reviews = await ReviewsModel.findOne({ order: order._id })
                return reviews
            })
        )
       res.status(200).json({ message: 'Orders fetched successfully', orders }) 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
