// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3001; // Port for our backend server

// --- Middleware ---
// Enable CORS so your frontend can make requests to this backend
app.use(cors());
// Allow the server to understand JSON data from requests
app.use(express.json());

// --- Connect to MongoDB ---
// IMPORTANT: Replace the link below with your own MongoDB Atlas connection string!
const mongoURI = 'mongodb+srv://bakery-admin:sairam_1234@cluster0.dax3sf.mongodb.net/bakeryDB?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Define a Schema and Model for Orders ---
// A schema is the blueprint for how data will be stored in the database.
// This is the CORRECTED line
const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cart: { type: Array, required: true }, // <-- This is the fix
    total: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// --- API Endpoint to Create an Order ---
// Your frontend will send a POST request to this URL.
// Ensure this part is correct ✅
app.post('/api/orders', async (req, res) => {
    try {
        const { name, phone, address, cart, total } = req.body;

        const newOrder = new Order({
            name: name,
            phone: phone,
            address: address,
            cart: cart, // Should be 'cart'
            total: total
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully!', order: savedOrder });

    } catch (error) {
        console.error('Failed to save order:', error); // This is the error that shows in your terminal
        res.status(500).json({ message: 'Failed to place order.' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});