const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://ecoloop:Eco12345!@ecoloopcluster.de6tllh.mongodb.net/?retryWrites=true&w=majority&appName=EcoLoopCluster')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// ✅ Define Mongoose Schema
const itemSchema = new mongoose.Schema({
  imgSrc: String,
  name: String,
  email: String,
  condition: String,
  objectName: String
});

const Item = mongoose.model('Item', itemSchema);

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: 'dnrlo5hbo',      
  api_key: '952345615312872',            
  api_secret: 'rVOIj1gpzmlOr75eoaNlpB-ZKjQ'       
});

// ✅ Setup Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecoloop-items',
    allowed_formats: ['jpg', 'jpeg', 'png']
  },
});

const upload = multer({ storage: storage });

// ✅ POST route to add item
app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    const { name, email, condition, objectName } = req.body;
    const imageUrl = req.file.path;

    const newItem = new Item({
      imgSrc: imageUrl,
      name,
      email,
      condition,
      objectName
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// ✅ GET route to fetch items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ _id: -1 }).limit(8);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
