import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

// tour(reviewModel.js) => products(orderModel.js), user(reviewModel.js) => buyers(orderModel.js)
const orderSchema = new Schema(
  {
    products: [{ type: ObjectId, ref: "Tour" }],
    payment: {},
    buyers: { type: ObjectId, ref: "User" },
    // seller: { type: ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;