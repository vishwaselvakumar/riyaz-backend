// routes/serviceCardRoutes.js

const express = require('express');
const router = express.Router();
const { upload } = require('../config/serviceCardstorage');
const serviceCardController = require('../controllers/serviceCardController');

router.post('/service-cards', upload.single('image'), serviceCardController.createServiceCard);
router.get('/servicecard/:id', serviceCardController.getCardById);
router.get('/service-cards/:id', serviceCardController.getServiceCard);
router.get('/service-cards/:id', serviceCardController.getServiceCard);
router.get('/service-cards/image/:filename', serviceCardController.getImage); 
router.get('/service-cards', serviceCardController.getAllServiceCards);
router.put('/servicecards/:id', serviceCardController.updateServiceCard);


module.exports = router;
