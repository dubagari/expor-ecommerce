import cloudinary from "../config/cloudnary"
import Order from "../models/order.model"
import User from "../models/user.model"
import Product from "../models/product.model"


export const createProduct = async(req, res) => {
    try {
        const {name,price,description,category,stock}=req.body
        const images=req.files
        if(!name || !price || !description || !category || !stock || !images){
            return res.status(400).json({message:"All fields are required"})
        }

        if (req.files.length > 3) {
          return res.status(400).json({message:"Maximum 3 images are allowed"})
        }

        const uploadedImages = req.files.map(file => {
            return cloudinary.uploader.upload(file.path), 
           { folder:"products"}
        })

        const uploadResult = await Promise.all(uploadedImages)

        const imagesUrl = uploadResult.map(result => result.secure_url)
        

        const product = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            images: imagesUrl
        })
        
        res.status(201).json({message:"Product created successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


export const updateProduct = async (req, res) => {
    
    try {
            const {id}=req.params
        const { name, price, description, category, stock } = req.body
        
        const product = await Product.findById(id)
    
        if(!product){
            return res.status(404).json({message:"Product not found"})
    }
    const images = req.files
    if(!name || !price || !description || !category || !stock || !images){
        return res.status(400).json({message:"All fields are required"})
    }

    if (req.files.length > 3) {
        return res.status(400).json({message:"Maximum 3 images are allowed"})
    }

    const uploadedImages = req.files.map(file => {
        return cloudinary.uploader.upload(file.path), 
        { folder:"products"}
    })

    const uploadResult = await Promise.all(uploadedImages)

    const imagesUrl = uploadResult.map(result => result.secure_url)
    

    const updatedProduct = await Product.findByIdAndUpdate(id, {
        name,
        price,
        description,
        category,
        stock,
        images: imagesUrl
    })
    await updatedProduct.save()
    res.status(201).json({message:"Product updated successfully"})

    } catch (error) {
        console.log('error updating product',error);
        res.status(500).json({message:"Internal server error"})
    }    
    
    
}


export const getAllProduct=async(req,res)=>{
    try {
        const products = await Product.find().sort({createdAt:-1})
        res.status(200).json(products)
    } catch (error) {
        console.log('error fetching products',error);
        res.status(500).json({message:"Internal server error"})
    }
}
export const deleteProduct=async(req,res)=>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Product deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
} 


export const getOrders = async(req,res)=>{
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("items.productId", "name images")
            .sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        console.log('error fetching orders',error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateOrderStatus = async(req,res)=>{
    try {
        const {id}=req.params
        const { status } = req.body
        
        if(!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)){
            return res.status(400).json({message:"Invalid status"})
        }

        const order = await Order.findById(id)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        order.status = status
        if(status === "delivered" && !order.deliveredAt){
            order.deliveredAt = new Date()
        }
        if(status === "shipped" && !order.shippedAt){
            order.shippedAt = new Date()
        }   
        if(status === "cancelled" && !order.cancelledAt){
            order.cancelledAt = new Date()
        }   
        if(status === "processing" && !order.processingAt){
            order.processingAt = new Date()
        }   
        if(status === "paid" && !order.paidAt){
            order.paidAt = new Date()
        }   
        if(status === "failed" && !order.failedAt){
            order.failedAt = new Date()
        }   
        if(status === "pending" && !order.pendingAt){
            order.pendingAt = new Date()
        }   
           
        await order.save()
        res.status(200).json({message:"Order updated successfully"})
    } catch (error) {
        console.log('error updating order',error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getDashboardStats = async(req,res)=>{
    try {
        const totalOrders = await Order.countDocuments()

        const revenue = await Order.aggregate([
            {
                $match: { status: "delivered" }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ])

        const totalRevenue = revenue[0]?.totalRevenue || 0

        const totalcustomers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()
        const totalUsers = await User.countDocuments()
        res.status(200)
            .json({
                totalOrders,
                totalProducts,
                totalUsers,
                totalRevenue,
                totalcustomers
            })
    } catch (error) {
        console.log('error fetching dashboard stats',error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getAllCustomers = async(req,res)=>{
    try {
        const users = await User.find().sort({createdAt:-1})
        res.status(200).json(users)
    } catch (error) {
        console.log('error fetching customers',error);
        res.status(500).json({message:"Internal server error"})
    }
}
