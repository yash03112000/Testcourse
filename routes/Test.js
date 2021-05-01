const express = require('express');
const router = express.Router();
const Test = require('../models/Test')
const Ques = require('../models/Question')
const Result = require('../models/TestResult');
const { FormControlLabel } = require('@material-ui/core');


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
            Result.find({test_id:test._id,user_id:req.user.id})
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
    Result.find({test_id:req.body.test,user_id:req.user.id})
        .exec()
        .then((test)=>{
            // console.log(test)
            if(test.length>0){
                var test = test[0];
                var ques = test.user_response.id(req.body.id);
                if(!ques.visited){
                    test.notvisited--;
                    test.notanswered++;
                    ques.visited = true;
                    ques.notanswered = true;
                    test.save()
                        .then((test)=>{
                            Ques.findById(req.body.id)
                                .exec()
                                .then((quesbody)=>{
                                    res.json({
                                        quesbody,
                                        result:test,
                                        ques
                                    })
                        
                                })
                                .catch((err)=>{
                                    console.log(err);
                                  })
                        })
                        .catch((err)=>{
                          console.log(err);
                        })
                }else{
                    Ques.findById(req.body.id)
                    .exec()
                    .then((quesbody)=>{
                        res.json({
                            quesbody,
                            result:test,
                            ques
                        })
            
                    })
                    .catch((err)=>{
                        console.log(err);
                      })
                }

            }else{

            }

        })
        .catch((err)=>{
          console.log(err);
        })

})

router.post('/save',(req,res)=>{
    Result.find({test_id:req.body.test,user_id:req.user.id})
        .exec()
        .then((test)=>{
            // console.log(test)
            if(test.length>0){
                var test = test[0];
                var ques = test.user_response.id(req.body.id);
                if(!ques.answered){
                    test.notanswered--;
                    test.answered++;
                    ques.answered = true;
                    ques.notanswered = false;
                    ques.response = req.body.answer;
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                          console.log(err);
                        })
                }else{
                    ques.response = req.body.answer;
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                }

            }else{

            }

        })
        .catch((err)=>{
          console.log(err);
        })    
})



router.post('/clearresponse',(req,res)=>{
    Result.find({test_id:req.body.test,user_id:req.user.id})
        .exec()
        .then((test)=>{
            // console.log(test)
            if(test.length>0){
                var test = test[0];
                var ques = test.user_response.id(req.body.id);
                if(ques.answered){
                    test.notanswered++;
                    test.answered--;
                    ques.answered = false;
                    ques.notanswered = true;
                    ques.response = [];
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                          console.log(err);
                        })
                }else{
                    ques.response = [];
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                }

            }else{

            }

        })
        .catch((err)=>{
          console.log(err);
        })    
})

module.exports = router;
