const express = require('express');

const productsController = require('../../controllers/controllersv1/products-controller');

const router = express.Router();

router.post('/create', productsController.createProduct);
router.get('/get-all', productsController.getProduct);
router.get('/get-by-user/:userId', productsController.getProductByUser);

// router.post('/update', productsController.updateProduct);

module.exports = router;