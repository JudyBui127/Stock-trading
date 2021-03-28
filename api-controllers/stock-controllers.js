const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
// let path = require("path");
const Tweet = require('../models/stock');
let config = require('../config');
const Wallet = require("../models/wallet");

module.exports = {
    addShares
};
const STATUS_CODE = {
    SUCCESS_ALL: { status: 200, message: "Success!" },
    BAD_REQUEST: { status: 400, message: 'Bad request!' },
    FAILED_ACTION: { status: 424, message: 'Failed Action!' },
    UNAUTHORIZED: { status: 401, message: 'Unauthorized!' },
    NOT_FOUND: { status: 404, message: 'Not found!' },
    INTERNAL_ERROR: { status: 500, message: 'Internal Server Error!' },
    INSUFFICIENT_BALANCE: { status: 424, message: 'Insufficient balance!' },
}

function addShares(req, res) {
    handleAddShares(req)
    .then(data => res.send(data))
    .catch(err => handleException(err, res))
}

//READ ALL TWEETS FROM USER
function readAllTweet(req, res) {
    const allTweet =  Tweet.findAll({ postedBy: req.body.user._id});
    if (!allTweet) return STATUS_CODE.NOT_FOUND;
    res.json(allTweet);
}

//READ 1 TWEET
function readTweet(req, res) {
    const tweet = Tweet.findById({ _id: req.params.id});
    if (!tweet) return STATUS_CODE.NOT_FOUND;
    res.json(tweet);
}

//UPDATE TWEET
function updateTweet(req,res){
    const tweetId=req.params.id;
    const updatedTweet={
        content: req.body.content,
        updated: Date.now()
    }
    update(tweetId,updatedTweet)
    .then(data => res.send(data))
    .catch(err => handleException(err, res))
}

//DELETE TWEET
function deleteTweet(req,res){
    const tweetId=req.params.id;
    del(tweetId)
    .then(data => res.send(data))
    .catch(err => handleException(err, res))
}

//HELPER FUNCTIONS

async function handleAddShares(req) {
    const { wallet_id, order_type, quantity, price, fiat_wallet_id } = req.body;
    const stockWallet = await Wallet.findById(wallet_id)
    const fiatWallet = await Wallet.findById(fiat_wallet_id)
    console.log({stockWallet, fiatWallet});
    if (!stockWallet || !fiatWallet) return STATUS_CODE.NOT_FOUND
    if (order_type === 'BUY') {
        const spend = quantity * price;
        const newBalance = fiatWallet.balance - spend
        console.log(newBalance);
        if (newBalance > 0) {
            const updatedFiat = fiatWallet.updateOne({balance: newBalance}, {new: true})
            const updateStock = {
                quantity: stockWallet.quantity + quantity
            } 
            const updatedStock = stockWallet.updateOne(updateStock, {new: true})
            return {...STATUS_CODE.SUCCESS_ALL, data: { updatedFiat, updatedStock }}
        } else return STATUS_CODE.INSUFFICIENT_BALANCE
    } else {
        
    }
    return STATUS_CODE.FAILED_ACTION;
}

async function update(tweetId,updatedTweet){
    const newUpdatedTweet = await Tweet.findByIdAndUpdate(tweetId,updatedTweet);
    if(!newUpdatedTweet) return STATUS_CODE.BAD_REQUEST;
    return {...STATUS_CODE.SUCCESS_ALL, newUpdatedTweet}

}

async function del(tweetId){
    const deleteTweet= await Tweet.findByIdAndDelete(tweetId);
    if(!newUpdatedTweet) return STATUS_CODE.NOT_FOUND;
    return {...STATUS_CODE.SUCCESS_ALL}
}