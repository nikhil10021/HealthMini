import mongoose from 'mongoose';
export async function connectDB(uri) {
  await mongoose.connect(uri, { dbName: "healthmini" });
  console.log("✅ MongoDB connected");
}
