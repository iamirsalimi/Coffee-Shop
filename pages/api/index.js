import connectToDB from "@/src/configs/dbs/db";

export default function handler(req, res) {
  connectToDB()
  res.status(200).json('welcome');
}
