const express = require("express");
const router = express.Router();
const middleware = require('./middleware/middleware');
const userController = require('./api-controllers/user-controllers');
const walletController = require('./api-controllers/wallet-controllers');
//USER
router.post('/user/register', userController.registerUser);
router.post('/user/login',userController.loginUser);
router.get('/user/:id',userController.getPortfolio);

// //WALLET
router.post('/wallet/create',middleware.checkToken,walletController.createWallet);
// // router.get('/wallet/readAll/:id',walletController.readAllwallet);
// router.get('/wallet/read/:id',walletController.readWallet);
// router.put('/wallet/update/:id',middleware.checkToken,walletController.updateWallet);

// // ADD BUY/SELL SHARES
// router.post('/wallet/addShares/',middleware.checkToken,walletController.addShares);

// //STOCK
// router.post('/stock/create',middleware.checkToken,stockController.createStock);
// // router.get('/stock/readAll/:id',stockController.readAllstock);
// router.get('/stock/read/:id',stockController.readstock);
// router.put('/stock/update/:id',middleware.checkToken,stockController.updatestock);

module.exports = router;