const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    name: String,
    cost: Number,
    category: String,
    unit: String,
    imgSRC: String
})
module.exports = model("Product", productSchema, "Product");

