const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGO_URI;

console.log('MongoURI:', mongoURI);

if (!mongoURI) {
  console.error('MongoURI is not defined. Check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Invoice Schema
const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  page: { type: Number, required: true },
  invoiceDate: { type: Date, default: Date.now }, // Updated to include current date and time
  orderDeliveryDate: { type: Date },
  customerName: { type: String },
  village: { type: String },
  mobileNumber: { type: String },
  sofaModel: { type: String },
  seaterType:{type: Number},
  softySeatingCharge: { type: Number },
  hrFoamSeatingCharge: { type: Number },
  coirFoamSeatingCharge: { type: Number },
  sofaSeatingCharge: { type: Number },
  fabricCharge: { type: Number },
  totalEstimationBill: { type: Number },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Define Sofa Schema
const sofaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  name: String,
  model: String,
  image: String,
});

const Sofa = mongoose.model('Sofa', sofaSchema);

// Routes for Invoices
app.post('/api/invoices', async (req, res) => {
  try {
    const newInvoice = new Invoice({
      ...req.body,
      id: uuidv4(), // Ensure new ID generation for each invoice
    });
    const savedInvoice = await newInvoice.save();
    return res.status(200).json(savedInvoice);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Routes for Sofas
app.post('/api/sofas', async (req, res) => {
  try {
    const newSofa = new Sofa({
      id: uuidv4(), // Generate a unique ID
      ...req.body
    });
    const savedSofa = await newSofa.save();
    return res.status(200).json(savedSofa);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/api/sofas', async (req, res) => {
  try {
    const sofas = await Sofa.find();
    return res.status(200).json(sofas);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
