const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gallerySchema = new Schema({
    caption: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    updatedDate: {
        type: Date,
    },
    createdBy: {
        type: String,
        required: true,
        default: null
    },
    path: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String,
    }
});


let galleryModel = mongoose.model('gallery', gallerySchema);
module.exports = galleryModel;