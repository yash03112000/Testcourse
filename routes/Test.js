const express = require('express');
const router = express.Router();
const Test = require('../models/Test')

router.get('/',(req,res)=>{
    Test.find({})
        .exec()
        .then((test)=>{
            console.log(test);
            res.json({
                suc:true
            })
        })
})

module.exports = router;
