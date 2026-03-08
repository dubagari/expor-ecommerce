import Review from "../models/Reviews.model.js";

// Create a review
export const createReview = async (req, res) => {
    try {
        const { userId, orderId, productId, rating, comment } = req.body;
        const review = new Review({
            userId,
            orderId,
            productId,
            rating,
            comment
        });
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all reviews
export const getReviews = async (req, res) => {
    try {
        const { productId } = req.query;
        let query = {};
        if (productId) query.productId = productId;
        const reviews = await Review.find(query)
            .populate("userId", "firstname surname imageUrl")
            .populate("productId", "name category image");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get review by ID
export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("userId", "firstname surname imageUrl")
            .populate("productId", "name");
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update review
export const updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedReview) return res.status(404).json({ message: "Review not found" });
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
