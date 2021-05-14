const { BlockOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');


const OptionSchema = new mongoose.Schema({
    content:{
        type:String
    },
    valid:{
        type:Boolean,
        default:false
    }


});

const QuestionSchema = new mongoose.Schema({
    question:{
        type:String
    },
    question_type:{
        type:String
    },
    option_1: OptionSchema,
    option_2: OptionSchema,
    option_3: OptionSchema,
    option_4: OptionSchema,
    answer:[String]



});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;