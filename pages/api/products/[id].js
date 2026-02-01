import formidable from "formidable";
import fs from "fs";
import path from "path";
import connectToDB from "@/src/configs/db";
import productsModel from "@/src/Models/Product";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";
import { authMiddleware } from "@/src/middlewares/authmiddleware";
import { middleware } from "@/src/utils/middleware";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (!["GET", "PATCH", "DELETE"].includes(req.method)) {
        return res.status(405).end();
    }

    try {
        await connectToDB();

        let reqAuthorization = req.headers.authorization;
        await middleware(reqAuthorization, res, authMiddleware);

        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // if user wasn't admin it will throw err 
        requireRole(user, ["ADMIN"]);

        const productId = req.query.id;

        switch (req.method) {

            case "GET": {
                const product = await productsModel.findById(productId).populate({
                    path: "comments",
                    // match: { isApproved: true },
                    options: { sort: { createdAt: -1 } },
                });
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                return res.status(200).json({ product });
            }

            case "PATCH": {
                // Keep files in memory until everything is validated
                const form = formidable({
                    multiples: false,
                    keepExtensions: true,
                    maxFileSize: 10 * 1024 * 1024, // optional: 10MB limit
                    // No uploadDir → file stays in temp memory location
                });

                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        return res.status(500).json({ message: "Parse error", error: err });
                    }

                    let newImageTempPath = null; // To clean up if error after saving

                    try {
                        // Find product by current slug
                        const product = await productsModel.findById(productId);
                        if (!product) {
                            return res.status(404).json({ message: "Product not found" });
                        }

                        // Extract text fields with fallback to existing values
                        const title = fields.title?.[0] || product.title;
                        const summary = fields.summary?.[0] || product.summary;
                        const description = fields.description?.[0] || product.description;
                        const smallPrice = fields.smallPrice?.[0] || product.smallPrice;
                        const mediumPrice = fields.mediumPrice?.[0] || product.mediumPrice;
                        const largePrice = fields.largePrice?.[0] || product.largePrice;
                        const category = fields.category?.[0] || product.category;
                        const isAvailable =
                            fields.isAvailable?.[0] !== undefined
                                ? fields.isAvailable[0] === "true"
                                : product.isAvailable;
                        const ingredients = JSON.parse(fields.ingredients) || JSON.parse(product.ingredients);

                        let imagePath = product.image; // Keep old image by default
                        let finalSlug = product.slug;

                        // Handle slug change (only if different and valid)
                        const newSlug = fields.slug?.[0]?.trim();
                        if (newSlug && newSlug !== product.slug) {
                            const slugExists = await productsModel.findOne({
                                slug: newSlug,
                                _id: { $ne: product._id },
                            });

                            if (slugExists) {
                                return res.status(400).json({
                                    message: "This slug is already used by another product",
                                });
                            }
                            finalSlug = newSlug;
                        }

                        // Handle new image upload
                        if (files.image && files.image[0]?.size > 0) {
                            const imageFile = files.image[0];

                            // ALL VALIDATIONS PASSED → Now save the image to disk
                            const uploadDir = path.join(process.cwd(), "public/uploads/products");
                            if (!fs.existsSync(uploadDir)) {
                                fs.mkdirSync(uploadDir, { recursive: true });
                            }

                            const newFilename = `${Date.now()}-${path.basename(
                                imageFile.originalFilename || "image"
                            )}`;
                            const finalFilePath = path.join(uploadDir, newFilename);
                            imagePath = `/uploads/products/${newFilename}`;

                            // Copy from formidable's temp path to our public folder
                            fs.copyFileSync(imageFile.filepath, finalFilePath);
                            newImageTempPath = imageFile.filepath; // remember temp path for cleanup on error

                            // Delete the old image from disk
                            if (product.image) {
                                const oldImagePath = path.join(process.cwd(), "public", product.image);
                                fs.unlink(oldImagePath, (unlinkErr) => {
                                    if (unlinkErr && unlinkErr.code !== "ENOENT") {
                                        console.error("Failed to delete old image:", unlinkErr);
                                    }
                                });
                            }
                        }

                        // Everything is good → Update the product in DB
                        const updatedProduct = await productsModel.findOneAndUpdate(
                            { _id: productId },
                            {
                                title,
                                summary,
                                description,
                                smallPrice,
                                mediumPrice,
                                largePrice,
                                category,
                                isAvailable,
                                ingredients,
                                image: imagePath,
                                slug: finalSlug,
                            },
                            { new: true }
                        );

                        return res.status(200).json({ product: updatedProduct });
                    } catch (error) {
                        console.error("PATCH PRODUCT ERROR:", error);

                        // If we saved a new image but failed later → delete it
                        if (newImageTempPath && fs.existsSync(newImageTempPath)) {
                            fs.unlink(newImageTempPath, () => { });
                        }

                        return res.status(500).json({ message: "Update failed", error });
                    }
                });

                return; // Prevent Next.js from sending response too early
            }

            case "DELETE": {
                const product = await productsModel.findByIdAndDelete(productId);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }

                // Optional: delete image from disk
                if (product.image) {
                    const imageFullPath = path.join(process.cwd(), "public", product.image);
                    fs.unlink(imageFullPath, (err) => {
                        if (err && err.code !== "ENOENT") console.error("Delete image error:", err);
                    });
                }

                return res.status(200).json({ message: "Product deleted successfully" });
            }
        }
    } catch (err) {
        console.error("API ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}