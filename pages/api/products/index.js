import formidable from "formidable";
import fs from "fs";
import path from "path";
import connectToDB from "@/src/configs/db";
import productsModel from "@/src/Models/Product";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST" && req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        await connectToDB();

        if (req.method == 'GET') {
            const products = await productsModel.find({}).populate({
                path: "comments",
                // match: { isApproved: true },
                options: { sort: { createdAt: -1 } },
            });
            return res.status(200).json({ products });
        } else if (req.method === "POST") {
            const user = verifyAccessToken(req, res);

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // if user wasn't admin it will throw err 
            requireRole(user, ["ADMIN"]);

            // IMPORTANT: Keep file in memory until validation passes
            const form = formidable({
                multiples: false,
                keepExtensions: true,
                maxFileSize: 10 * 1024 * 1024, // 10MB limit (optional)
                // Do NOT set uploadDir yet → file stays in memory
            });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ message: "Parse error" });
                }

                let tempFilePath = null; // We'll store the path if we write it later

                try {
                    // Extract fields first
                    const title = fields.title?.[0];
                    const summary = fields.summary?.[0];
                    const description = fields.description?.[0];
                    const smallPrice = fields.smallPrice?.[0];
                    const mediumPrice = fields.mediumPrice?.[0];
                    const largePrice = fields.largePrice?.[0];
                    const category = fields.category?.[0];
                    const isAvailable = fields.isAvailable?.[0] === "true";
                    const ingredients = fields.ingredients || [];
                    const slug = fields.slug?.[0]?.trim();

                    // Validate required fields
                    if (!title || !summary || !description || !category || !slug) {
                        return res.status(400).json({ message: "Missing required fields" });
                    }

                    // Check image
                    const imageFileArray = files.image;
                    if (!imageFileArray || !imageFileArray[0] || imageFileArray[0].size === 0) {
                        return res.status(400).json({ message: "Image is required" });
                    }
                    const imageFile = imageFileArray[0];

                    // Check duplicate slug BEFORE saving file
                    const existingProduct = await productsModel.findOne({ slug });
                    if (existingProduct) {
                        return res.status(400).json({
                            message: "This slug is already in use. Please choose a different one.",
                        });
                    }

                    // ALL VALIDATIONS PASSED → Now save the image to disk
                    const uploadDir = path.join(process.cwd(), "public/uploads/products");
                    // Create dir if not exists
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const newFilename = `${Date.now()}-${imageFile.originalFilename || "image"}`;
                    const finalPath = path.join(uploadDir, newFilename);
                    const imagePath = `/uploads/products/${newFilename}`;

                    // Copy from temp location (formidable temp) to final location
                    fs.copyFileSync(imageFile.filepath, finalPath);
                    tempFilePath = imageFile.filepath; // remember to clean later if needed

                    // Create product in DB
                    const product = await productsModel.create({
                        title,
                        summary,
                        description,
                        smallPrice,
                        mediumPrice,
                        largePrice,
                        category,
                        ingredients,
                        isAvailable,
                        slug,
                        image: imagePath,
                    });

                    return res.status(201).json({ product });
                } catch (error) {
                    console.error("CREATE PRODUCT ERROR:", error);

                    // If we saved the file but failed → delete it
                    if (tempFilePath && fs.existsSync(tempFilePath)) {
                        fs.unlink(tempFilePath, () => { }); // best effort cleanup
                    }

                    return res.status(500).json({ message: "Internal server error", error });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}