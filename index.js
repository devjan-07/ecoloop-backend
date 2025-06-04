const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://ecoloop:Eco12345!@ecoloopcluster.de6tllh.mongodb.net/?retryWrites=true&w=majority&appName=EcoLoopCluster')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Define a schema for items
const itemSchema = new mongoose.Schema({
  imgSrc: String,
  name: String,
  email: String,
  condition: String,
  objectName: String
});

const Item = mongoose.model('Item', itemSchema);

// POST route to add an item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// GET route to fetch items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ _id: -1 }).limit(8);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});