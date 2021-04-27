const { BlockOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    title :{
        type:String
    },
    question_id : [mongoose.Types.ObjectId],
    question_marks_correct : [Number],
    question_marks_wrong : [Number],
    question_timings : [Number],
    section_id:[String]
});

const User = mongoose.model('Test', UserSchema);

module.exports = User;