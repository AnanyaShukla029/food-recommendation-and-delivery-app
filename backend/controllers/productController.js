import productModel from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

const addProduct = async (req, res) => {
    try {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file uploaded" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error); // Log Cloudinary errors
                    return res.status(500).json({ success: false, message: "Image upload failed" });
                }

                const product = new productModel({
                    id: uniqueId,
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    category: req.body.category,
                    image: result.secure_url // Save Cloudinary URL
                });

                product.save()
                    .then(() => res.json({ success: true, message: "Product Added", imageUrl: result.secure_url }))
                    .catch(saveError => {
                        console.error("Database save error:", saveError); // Log database save errors
                        res.status(500).json({ success: false, message: "Product save failed" });
                    });
            }
        ).end(req.file.buffer); // Stream image buffer to Cloudinary

    } catch (error) {
        console.error("Unexpected server error:", error); // Log unexpected errors
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);

        // Remove image from Cloudinary
        const publicId = product.image.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(publicId);

        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const searchProduct = async (req, res) => {
    try {
        const searchQuery = req.query.q;

        if (!searchQuery || typeof searchQuery !== 'string') {
            return res.json({ success: false, message: 'Invalid search query' });
        }

        const products = await productModel.find({
            name: { $regex: searchQuery, $options: 'i' }
        });

        res.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error while searching' });
    }
};

export { addProduct, listProduct, removeProduct, searchProduct };
