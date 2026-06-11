const {Schema, model} = require('mongoose');

const reviewSchema = new Schema({
    login: String,
    text: {type: String}
})

module.exports = model("Review",reviewSchema, "Review" );