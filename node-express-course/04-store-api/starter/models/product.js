const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: [true, 'cannot be empty value'],
        maxLength: [50, 'name cannot be more than 50 chars'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'cannot be empty value'],
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported'
        },
        required: [true, 'cannot be empty value'],
        maxLength: [50, 'name cannot be more than 50 chars'],
        trim: true,
    }
})

module.exports = mongoose.model('Products', productSchema);