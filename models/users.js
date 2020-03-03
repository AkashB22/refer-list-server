let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    uniqueId: String,
    waitingListId: {
        type: Schema.Types.ObjectId,
        ref: 'waiting-list'
    },
    referredUsers: [String]
},{
    timestamps: true
});

module.exports = mongoose.model('user', UserSchema);