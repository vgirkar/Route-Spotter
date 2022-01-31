const mongoose = require('mongoose');
const Rsvp = require('./Rsvp');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    name: {type: String, required: [true, 'Title is required']},
    topic: {type: String, required: [true, 'Topic is required']},
    details: {type: String, required: [true, 'Detail is required'], 
              minLength: [10, 'The detail should have at least 10 characters']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: [true, 'Location is required']},
    date: {type: String, required: [true, 'Date is required']},
    startTime: {type: String, required: [true, 'Start time is required']},
    endTime: {type: String, required: [true, 'End Time is required']},
    image: {type: String, required: [true, 'Image is required']},
},
{timestamps: true}
);

connectionSchema.pre('deleteOne', function(next) {
    let id = this.getQuery()['_id'];
    Rsvp.deleteMany({ connection: id}).exec();
    next();
});

module.exports = mongoose.model('Connection', connectionSchema);


