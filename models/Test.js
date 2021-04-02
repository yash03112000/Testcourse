const { BlockOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id :{
        type:  mongoose.Types.ObjectId
    },
    category_id :{
        type:  mongoose.Types.ObjectId
    },
    sub_category_id : {
        type:  mongoose.Types.ObjectId
    },
    school_level : {
        type:  Number
    },
    is_top_test : {
        type:Boolean
    },
    is_featured_test : {
        type:Boolean
    },
    is_popular_test : {
        type:Boolean
    },
    is_newarrival_test : {
        type:Boolean
    },
    is_previous_year_test : {
        type:Boolean
    },
    is_active : {
        type:Boolean
    },
    attempt_allowed : {
        type:  Number
    },
    meta_keywords :{
        type:  String
    },
    meta_description : {
        type:  String
    },
    enrol_required : {
        type:Boolean
    },
    is_free : {
        type:Boolean
    },
    is_on_sale : {
        type:Boolean
    },
    price : {
        type: Number
    },
    sale_price : {
        type:  Number
    },
    tag : [mongoose.Types.ObjectId],
    title :{
        type:String
    },
    // "thumbnail" : "thumbnail",
    // "is_intro_video" : 0,
    // "intro_video_url" : "",
    // "short_description" : "short_description",
    // "description" : "description",
    // "instruction" : "General Instructions:[html]",
    // "other_instructions" : "<p>details of other instruction</p>",
    // "terms_condition_text" : "<p>terms and condition paragraph at check tick</p>",
    // "outcomes" : [ 
    //     "Outcomes-1", 
    //     "Outcomes-1", 
    //     "Outcomes-1"
    // ],
    // "requirements" : [ 
    //     "Requirements-1", 
    //     "Requirements-2", 
    //     "Requirements-3"
    // ],
    // "section_test_id" : [ 
    //     1, 
    //     1, 
    //     1, 
    //     2, 
    //     2, 
    //     2, 
    //     2, 
    //     2, 
    //     2, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1
    // ],
    // "question_id" : [ 
    //     1, 
    //     2, 
    //     3, 
    //     4, 
    //     5, 
    //     6, 
    //     7, 
    //     8, 
    //     9, 
    //     10, 
    //     11, 
    //     12, 
    //     13, 
    //     14, 
    //     15
    // ],
    // "question_marks_correct" : [ 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1, 
    //     1
    // ],
    // "question_marks_wrong" : [ 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1, 
    //     -1
    // ],
    // "question_marks_ignore" : [ 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5, 
    //     -0.5
    // ],
    // "test_duration" : 900,
    // "is_individual_question_time" : 1,
    // "question_timing" : [ 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60, 
    //     60
    // ],
    // "publish_later" : 1,
    // "publish_date" : "date",
    // "date_added" : "date_added",
    // "last_modified" : "last_modified"
});

const User = mongoose.model('Test', UserSchema);

module.exports = User;