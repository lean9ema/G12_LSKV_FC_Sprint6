const express = require('express');
const router = express.Router();
const path = require('path');

var upload = require('../middlewares/img-products');

const productController = require('../controllers/productController');
const validatorProd = require('../middlewares/product-validator');

router.get('/', productController.list);

router.get('/create',productController.create);
router.post('/',upload.fields([{name: 'image'},{name: 'images'}]), validatorProd, productController.store);

// mediante res query
router.get('/filter', productController.filter);

router.get('/productCart' ,productController.prodCart1 );
router.get('/productCart2',productController.prodCart2 );
router.get('/productCart3',productController.prodCart3 );
router.get('/productCart4',productController.prodCart4 );

router.get('/:productId', productController.prodDetail );
router.post('/:id/prodCart',productController.prodCart)

router.put("/:id/edit",upload.fields([{name: 'image'},{name: 'images'}]), productController.prodEdition);
router.get("/:id/edit", productController.edition);

router.delete('/:id', productController.destroy);

module.exports = router;