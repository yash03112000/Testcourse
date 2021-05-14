const { BlockOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    title :{
        type:String
    },
    startindex:{
        type:Number
    },
    endindex:{
        type:Number
    },
});

const TestSchema = new mongoose.Schema({
    title :{
        type:String
    },
    question_id : [mongoose.Types.ObjectId],
    question_marks_correct : [Number],
    question_marks_wrong : [Number],
    question_timings : [Number],
    section_id:[SectionSchema]
});

const User = mongoose.model('Test', TestSchema);

module.exports = User;