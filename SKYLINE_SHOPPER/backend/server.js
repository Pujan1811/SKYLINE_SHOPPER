const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/skyline_shopper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB (Skyline Shopper)'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Order Schema
const orderSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  userID: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now },
  image: { type: String },
});

// Order Model
const Order = mongoose.model('Order', orderSchema);

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Save Order Endpoint
app.post('/saveOrder', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, message: 'Order saved successfully.' });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ success: false, message: 'Error saving order.' });
  }
});

// Get All Orders Endpoint
app.get('/getOrders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ success: false, message: 'Error retrieving orders.' });
  }
});

// Serve HTML Page
app.get('/orders.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/orders.html'));
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
