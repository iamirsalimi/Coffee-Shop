import connectToDB from "@/src/configs/db";
import productsModel from "@/src/Models/Product";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  try {
    await connectToDB();

    const product = await productsModel.findOne({ slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("GET BY SLUG ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}