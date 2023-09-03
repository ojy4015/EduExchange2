const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [{ type: ObjectId, ref: "Tour" }],
    payment: {},
    buyer: { type: ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Done",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;