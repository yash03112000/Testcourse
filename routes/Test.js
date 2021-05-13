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
            // console.log(arr)
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
                if(req.body.answer.length>0){
                    if(!ques.answered){
                        if(ques.notanswered){
                            test.notanswered--;
                            ques.notanswered = false;
                        }else if(ques.markedanswered){
                            test.markedanswered--;
                            ques.markedanswered = false;
                        }else if(ques.markedforreview){
                            test.markedforreview--;
                            ques.markedforreview = false;
                        }
                        test.answered++;
                        ques.answered = true;
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
                    if(!ques.answered){
                        if(ques.notanswered){

                        }else if(ques.markedanswered){
                            test.markedanswered--;
                            ques.markedanswered = false;
                            test.markedforreview++;
                            ques.markedforreview = true;
                        }else if(ques.markedforreview){

                        }
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
                        ques.answered = false;
                        ques.notanswered = true;
                        test.answered--;
                        test.notanswered++;
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
                }else if(ques.markedanswered){
                    test.markedforreview++;
                    test.markedanswered--;
                    ques.markedanswered = false;
                    ques.markedforreview = true;
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


router.post('/review',(req,res)=>{
    Result.find({test_id:req.body.test,user_id:req.user.id})
        .exec()
        .then((test)=>{
            // console.log(test)
            if(test.length>0){
                var test = test[0];
                var ques = test.user_response.id(req.body.id);
                if(ques.markedanswered){
                    ques.response = req.body.answer;
                    if(req.body.answer.length>0){

                    }else{
                        ques.markedanswered = false;
                        ques.markedforreview = true;
                        test.markedanswered --;
                        test.markedforreview++;
                    }
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                          console.log(err);
                        })
                }else if(ques.markedforreview){
                    ques.response = req.body.answer;
                    if(req.body.answer.length>0){
                        ques.markedanswered = true;
                        ques.markedforreview = false;
                        test.markedanswered ++;
                        test.markedforreview--;
                    }
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                          console.log(err);
                        })
                }else if(ques.answered){
                    ques.response = req.body.answer;
                    if(req.body.answer.length>0){
                        ques.markedanswered = true;
                        ques.answered = false;
                        test.markedanswered ++;
                        test.answered--;
                    }else{
                        ques.answered = true;
                        ques.markedforreview = false;
                        test.answered --;
                        test.markedforreview++;
                    }
                    test.save()
                        .then((test)=>{
                            res.json({
                                result:test
                            })
                        })
                        .catch((err)=>{
                          console.log(err);
                        })
                }else if(ques.notanswered){
                    ques.response = req.body.answer;
                    if(req.body.answer.length>0){
                        ques.markedanswered = true;
                        ques.notanswered = false;
                        test.markedanswered ++;
                        test.notanswered--;
                    }else{
                        ques.notanswered = false;
                        ques.markedforreview = true;
                        test.notanswered --;
                        test.markedforreview++;
                    }
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
