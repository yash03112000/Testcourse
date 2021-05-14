const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
    visited:{
        type:Boolean,
        default:false
    },
    answered:{
        type:Boolean,
        default:false
    },
    notanswered:{
        type:Boolean,
        default:false
    },
    markedanswered:{
        type:Boolean,
        default:false
    },
    markedforreview:{
        type:Boolean,
        default:false
    },
    response:{
        type:Array,
        default:[]
    },
    marks_correct:{
        type:Number,
        default:0
    },
    marks_wrong:{
        type:Number,
        default:0
    },
    user_score:{
        type:Number,
        default:0
    },
    iscorrect:{
        type:Boolean,
        default:false
    }

});

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
    score:{
        type:Number,
        default:0
    },
    correct:{
        type:Number,
        default:0
    },
    attempt:{
        type:Number,
        default:0
    }
    
});

const TestResultSchema = new mongoose.Schema({
    test_id:{
        type:mongoose.Types.ObjectId
    },
    user_id:{
        type:mongoose.Types.ObjectId
    },
    is_test_completed:{
        type:Boolean,
        default:false
    },
    computation:{
        type:Boolean,
        default:false
    },
    user_response:[QuestionSchema],
    sections:[SectionSchema],
    answered:{
        type:Number,
        default:0
    },
    notanswered:{
        type:Number,
        default:0
    },
    notvisited:{
        type:Number
    },
    markedforreview:{
        type:Number,
        default:0
    },
    markedanswered:{
        type:Number,
        default:0
    },
    totalscore:{
        type:Number,
        default:0
    }



});

const TestResult = mongoose.model('TestResult', TestResultSchema);

module.exports = TestResult;