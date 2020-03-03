let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let waitingListSchema = new Schema({
    position: {
        type: Number,
        default: 10
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('waiting-list', waitingListSchema);