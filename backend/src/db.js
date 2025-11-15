import mongoose from 'mongoose';
export async function connectDB(uri) {
  await mongoose.connect(uri, { dbName: "healthmini123456" });
  console.log("✅ MongoDB connected  123456");
}
