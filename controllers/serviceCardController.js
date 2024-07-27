const ServiceCard = require('../modals/serviceCardModel');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  const db = conn.db;
  bucket = new GridFSBucket(db, { bucketName: 'servicecard' });
});
//working code
exports.createServiceCard = async (req, res) => {
  try {
    const { heading, description, imageurl } = req.body;
    const newServiceCard = new ServiceCard({ heading, description, imageurl });
    await newServiceCard.save();
    res.status(201).json({
      message: `Service card created successfully with heading: ${newServiceCard.heading}`,
      newServiceCard,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ServiceCard.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getServiceCard = async (req, res) => {
  try {
    const serviceCard = await ServiceCard.findById(req.params.id);
    if (!serviceCard) {
      return res.status(404).json({ error: 'Service Card not found' });
    }
    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServiceCardsWithImages = async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({ error: 'GridFS not initialized' });
    }

    // Fetch all service cards
    const serviceCards = await ServiceCard.find();

    // Fetch all image files from GridFS
    bucket.find().toArray((err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching files: ' + err.message });
      }

      if (!files || files.length === 0) {
        return res.status(404).json({ error: 'No files found' });
      }

      // Filter out only image files
      const imageFiles = files.filter(file => file.contentType.startsWith('image/'));

      // Map image filenames to their respective URLs
      const imageMap = imageFiles.reduce((map, file) => {
        map[file.filename] = `${req.protocol}://${req.get('host')}/api/service-cards/image/${file.filename}`;
        return map;
      }, {});

      // Combine service card data with image URLs
      const serviceCardsWithImages = serviceCards.map(card => ({
        ...card.toObject(),
        imageUrl: imageMap[card.image] || null // Add image URL if it exists
      }));

      res.status(200).json(serviceCardsWithImages);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service cards with images', error });
  }
};

exports.getImage = (req, res) => {
  const { filename } = req.params;

  if (!bucket) {
    return res.status(500).json({ error: 'GridFS not initialized' });
  }

  bucket.find({ filename }).toArray((err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching file: ' + err.message });
    }

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No file found' });
    }

    const file = files[0];
    if (file.contentType.startsWith('image/')) {
      res.set('Content-Type', file.contentType);
      const readstream = bucket.openDownloadStream(file._id);
      readstream.pipe(res).on('error', (err) => {
        res.status(500).json({ error: 'Error streaming file: ' + err.message });
      });
    } else {
      res.status(404).json({ error: 'File is not an image' });
    }
  });
};
//working code
exports.getAllServiceCards = async (req, res) => {
  try {
    const serviceCards = await ServiceCard.find();
    res.status(200).json(serviceCards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service cards', error });
  }
};
//working code
exports.updateServiceCard = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedCard = await ServiceCard.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ message: 'Service card not found' });
    }
    res.status(200).json({
      message: `Service card updated successfully with heading: ${updatedCard.heading}`,
      updatedCard
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


