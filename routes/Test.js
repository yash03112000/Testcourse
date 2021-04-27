const express = require('express');
const router = express.Router();
const Test = require('../models/Test')
const Ques = require('../models/Question')
const Result = require('../models/TestResult')


router.get('/:id',(req,res)=>{
    // console.log('here')
    Test.findById(req.params.id)
        .exec()
        .then((test)=>{
            var arr = [];
            test.question_id.map((q,i)=>{
                var a = {};
                a._id = q;
                arr.push(a);
            })
            console.log(arr)
            Result.find({test_id:test._id,user_id:req.user_id})
                .exec()
                .then((result)=>{
                    if(result.length>0){
                        var a = result[0]
                        res.json({
                            test,
                            result:a
                        })                        
                    }else{
                        var result = new Result;
                        result.test_id = test._id;
                        result.user_id = req.user.id;
                        result.user_response = arr;
                        result.notvisited = test.question_id.length;
                        result.save()
                            .then(()=>{
                                res.json({
                                    test,
                                    result
                                })
                            })
                    }
                

        })
    })
})


router.post('/question',(req,res)=>{
    Ques.findById(req.body.id)
        .exec()
        .then((ques)=>{
            res.json({
                ques
            })

        })
})

module.exports = router;
