import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { errorHandler } from "../middleware/error.js";

export const signup = async (req, res, next) => {
  try {
    const { firstname, surname, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      surname,
      email,
      password: hash,
   
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });

    if (!validUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: "Wrong credentials" });

    const token = jwt.sign(
      { id: validUser._id, },
      process.env.JWT_SECRET
    );

    const { password: pass, ...userData } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, ...userData });
  } catch (error) {
    next(errorHandler(401, error.message));
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// GET all users (admin only)
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // never send passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addAddress = async (req, res) => {
  try {
    const { label, fullName, streetAddress, city, state, zip, country, phoneNumber, isDefault } = req.body
    
    const user = req.user 
    
    if(isDefault){
        user.address.forEach(address => {
            address.isDefault = false
        })
    }
    user.address.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zip,
      country,
      phoneNumber,
      isDefault
    })
    await user.save()
    res.status(200).json({message:"Address added successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}     

export const getAddress = async (req, res) => {
    try {
      const user = req.user
      res.status(200).json({
        success: true,
        address: user.address
      })
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}   

export const updateAddress = async (req, res) => {
    try {
      const { label, fullName, streetAddress, city, state, zip, country, phoneNumber, isDefault } = req.body

      const {addressId} = req.params
      const user = req.user
      
      const address = user.address.id(addressId)
      if(!address){
        return res.status(404).json({message:"Address not found"})
      }
      
      if(isDefault){
        user.address.forEach(address => {
            address.isDefault = false
        })
      }

      address.label = label || address.label
      address.fullName = fullName || address.fullName
      address.streetAddress = streetAddress || address.streetAddress
      address.city = city || address.city
      address.state = state || address.state 
      address.zip = zip || address.zip
      address.country = country || address.country
      address.phoneNumber = phoneNumber || address.phoneNumber
      address.isDefault = isDefault !== undefined ? isDefault : address.isDefault 
      await user.save()
      res.status(200).json({message:"Address updated successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}   

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params
        const user = req.user
        
        const address = user.address.pull(addressId)
        if(!address){
            return res.status(404).json({message:"Address not found"})
        }
        await user.save()
        res.status(200).json({message:"Address deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}     

export const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body
      const user = req.user
      

        if(user.wishlist.includes(productId)){
            return res.status(400).json({message:"Product already in wishlist"})
      }
      
        user.wishlist.push(productId)
      await user.save() 
      
        res.status(200).json({message:"Wishlist added successfully", wishlist: user.wishlist})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}     

export const getWishlist = async (req, res) => {
    try {
      
        const user = await User.findById(req.user._id).populate("wishlist")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({wishlist:user.wishlist})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}   

export const deleteWishlist = async (req, res) => {
    try {
      const { productId } = req.params
      
      const user = req.user
        if(!user.wishlist.includes(productId)){
            return res.status(400).json({message:"Product is not even in wishlist"})
      }
      user.wishlist.pull(productId)
       
        
        await user.save()
        res.status(200).json({message:"Wishlist deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}     
