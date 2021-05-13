import Head from 'next/head'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import React, {useState,useEffect} from 'react';
import ReactDOM,{unstable_batchedUpdates as unstable} from "react-dom";
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel,Checkbox,Modal} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { server } from '../config';
import parse from 'html-react-parser';
const useStyles = makeStyles((theme) => ({


    sec1:{
        // height:50,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EEEEEE'

    },
    sec2:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        // backgroundColor:'pink'
    },
    sec3:{
        padding:10
    },
    sec5:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-end',
        backgroundColor:'#38A9EB',
        padding:8,
        marginBottom:10     
    },
    sec7:{
        overflow:'scroll'
    }
}));

export default function Question({id,changeresult,result,quesarr,changequesarr}) {
  const [lang,setLang] = useState('');
  const [loading,setLoading] = useState(true);
  const [ques,setQues] = useState({});
  const [answer,setAnswer] = useState([])
  const router = useRouter()
  const classes = useStyles();
  const {id:test} = router.query;

  useEffect(()=>{
      initial();
  },[id])

  const initial = ()=>{
      setLoading(true);
      var data = [...quesarr];
      data.map((q,i)=>{
          if(q._id===id){
              if(q.done){
                unstable(()=>{
                    setQues(q.content.quesbody)
                    setAnswer(q.content.response)
                    setLoading(false)
                })
              }else{
                fetch(`${server}/Testserver/question`, {method: 'POST',headers: {
                    'Content-Type': 'application/json'}, body: JSON.stringify({id,test})})
                    .then(res => {
                        // console.log(res.status)
                        if(res.status === 200){
                          res.json().then((res)=>{
                            // console.log(res)
                            unstable(()=>{
                                data[i].content.quesbody = res.quesbody;
                                data[i].content.response = res.ques.response;
                                data[i].done = true;
                                // console.log(data[i])
                                // changequesarr(data)
                                setQues(res.quesbody)
                                setAnswer(res.ques.response)

                            })
                            changeresult(res.result,id,data,false)
                            setLoading(false)            
                          })
                        }
                    })
                }
          }
      })

  }

  const qnum= (id)=>{
    var i =0;
    for(i=0;i<result.user_response.length;i++){
        if(result.user_response[i]._id === id){
            return (i+1)

        }
    }
    }
  const savefun = ()=>{
    // setLoading(true);
    fetch(`${server}/Testserver/save`, {method: 'POST',headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({id,test,answer})})
        .then(res => {
            // console.log(res.status)
            if(res.status === 200){
                res.json().then((res)=>{
                    var data = [...quesarr];
                    data.map((q,i)=>{
                        if(q._id===id){
                            data[i].content.response = answer;
                            unstable(()=>{
                                changeresult(res.result,id,data,true)
                                // changequesarr(data);
                            })
                        }                            
                    })
                })
            }
        })
    }
    const clearresponse = ()=>{
        // setLoading(true);
        fetch(`${server}/Testserver/clearresponse`, {method: 'POST',headers: {
            'Content-Type': 'application/json'}, body: JSON.stringify({id,test})})
            .then(res => {
                // console.log(res.status)
                if(res.status === 200){
                    res.json().then((res)=>{
                        var data = [...quesarr];
                        data.map((q,i)=>{
                            if(q._id===id){
                                console.log('aa')
                                data[i].content.response = [];
                                setAnswer([])
                                unstable(()=>{
                                    // changequesarr(data);
                                    changeresult(res.result,id,data,false)
                                })
                            }                            
                        })

                    })
                }
            })
        }
    const review = ()=>{
        // setLoading(true);
        fetch(`${server}/Testserver/review`, {method: 'POST',headers: {
            'Content-Type': 'application/json'}, body: JSON.stringify({id,test,answer})})
            .then(res => {
                // console.log(res.status)
                if(res.status === 200){
                    res.json().then((res)=>{
                        var data = [...quesarr];
                        data.map((q,i)=>{
                            if(q._id===id){
                                data[i].content.response = answer;
                                unstable(()=>{
                                    // changequesarr(data);
                                    changeresult(res.result,id,data,true)
                                })
                            }                            
                        })
                    })
                }
            })
        }




  const qtype = (ques)=>{
      if(ques.question_type === 'SCQ'){
        // var a = answer.length>0?answer[0]:" ";
        // console.log(a)
        var op1 = ques.option_1._id;
        var op2 = ques.option_2._id;
        var op3 = ques.option_3._id;
        var op4 = ques.option_4._id;
        var a = {
            [op1]:false,
            [op2]:false,
            [op3]:false,
            [op4]:false
        }
        var i = 0;
        for(i=0;i<answer.length;i++) a[answer[i]] = true;
      //   console.log(a)
      const fun = ()=>{
          var arr = [];
          if(a[op1]) arr.push(op1);
          if(a[op2]) arr.push(op2);
          if(a[op3]) arr.push(op3);
          if(a[op4]) arr.push(op4);
          setAnswer(arr)
      }
          return (
            <div className={classes.sec7}>
                <div style={{margin:10}}>

                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black'}} >
                        {parse(ques.question)}
                    </Typography>
                    <RadioGroup aria-label="quiz" name="quiz" style={{color:'black',padding:8}}>
                        {ques.option_1.valid?<FormControlLabel value={ques.option_1._id} control={<Radio checked={a[ques.option_1._id]} onChange={(e)=>{a[op1]=e.target.checked;fun()}}/>} label={parse(ques.option_1.content)} />:<></>}
                        {ques.option_2.valid?<FormControlLabel value={ques.option_2._id} control={<Radio checked={a[ques.option_2._id]} onChange={(e)=>{a[op2]=e.target.checked;fun()}}/>} label={parse(ques.option_2.content)} />:<></>}
                        {ques.option_3.valid?<FormControlLabel value={ques.option_3._id} control={<Radio checked={a[ques.option_3._id]} onChange={(e)=>{a[op3]=e.target.checked;fun()}}/>} label={parse(ques.option_3.content)} />:<></>}
                        {ques.option_4.valid?<FormControlLabel value={ques.option_4._id} control={<Radio checked={a[ques.option_4._id]} onChange={(e)=>{a[op4]=e.target.checked;fun()}}/>} label={parse(ques.option_4.content)} />:<></>}
                        {/* {ques.option_5.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_5.content)} />:<></>} */}
                    </RadioGroup>
                </div>
            </div>
          )
      }else if(ques.question_type === 'MCQ'){
          var op1 = ques.option_1._id;
          var op2 = ques.option_2._id;
          var op3 = ques.option_3._id;
          var op4 = ques.option_4._id;
          var a = {
              [op1]:false,
              [op2]:false,
              [op3]:false,
              [op4]:false
          }
          var i = 0;
          for(i=0;i<answer.length;i++) a[answer[i]] = true;
        //   console.log(a)
        const fun = ()=>{
            var arr = [];
            if(a[op1]) arr.push(op1);
            if(a[op2]) arr.push(op2);
            if(a[op3]) arr.push(op3);
            if(a[op4]) arr.push(op4);
            setAnswer(arr)
        }
        return (
            <div className={classes.sec7}>
                <div style={{margin:10}}>
                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black'}} >
                        {parse(ques.question)}
                    </Typography>
                    <RadioGroup aria-label="quiz" name="quiz" style={{color:'black',padding:8}}>
                        {ques.option_1.valid?<FormControlLabel value="a" control={<Checkbox checked={a[ques.option_1._id]} onChange={(e)=>{a[op1]=e.target.checked;fun()}}/>} label={parse(ques.option_1.content)} />:<></>}
                        {ques.option_2.valid?<FormControlLabel value="a" control={<Checkbox checked={a[ques.option_2._id]} onChange={(e)=>{a[op2]=e.target.checked;fun()}}/>} label={parse(ques.option_2.content)} />:<></>}
                        {ques.option_3.valid?<FormControlLabel value="a" control={<Checkbox checked={a[ques.option_3._id]} onChange={(e)=>{a[op3]=e.target.checked;fun()}}/>} label={parse(ques.option_3.content)} />:<></>}
                        {ques.option_4.valid?<FormControlLabel value="a" control={<Checkbox checked={a[ques.option_4._id]} onChange={(e)=>{a[op4]=e.target.checked;fun()}}/>} label={parse(ques.option_4.content)} />:<></>}
                        {/* {ques.option_5.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_5.content)} />:<></>} */}
                    </RadioGroup>
                </div>
            </div>
          )          
      }else if(ques.question_type === 'Fill'){
          var a = answer.length>0?answer[0]:"";
        return (
            <div className={classes.sec7}>
                <div style={{margin:10}}>
                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black'}} >
                        {parse(ques.question)}
                    </Typography>
                    <TextField  type="username" required label="Username" name="username" variant="outlined" size="small" autoFocus  value={a} onChange={(e)=>{setAnswer([e.target.value])}}   InputProps={{
                      }}/>
                </div>
            </div>
          )          
      }
  }








  return (
    <>
        {loading?<h1>Loading...</h1>:
        <>
            <div className={classes.sec4}>
                <div>
                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'red',padding:8,margin:5}} >
                    Question Type : {ques.question_type}
                    </Typography>
                </div>
            </div>
            <div className={classes.sec5}>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'white',margin:6}} >
                    ViewIn:
                    </Typography>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    onChange={(e)=>setLang(e.target.value)}
                    value={lang}
                    style={{minWidth:30}}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </div>
            </div>
            <div className={classes.sec6}>
                <div>
                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',padding:8}} >
                    Question NO : {qnum(id)}
                    </Typography>
                </div>
            </div>
            {qtype(ques)}
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',marginTop:'auto'}}>
                <Button variant="contained" onClick={review} style={{backgroundColor:'#286090'}}>
                Mark For Review And Next
                </Button>
                <Button variant="contained" onClick={clearresponse} style={{backgroundColor:'#E74500'}}>
                Clear Response
                </Button>
                <Button variant="contained" onClick={savefun} style={{backgroundColor:'#449D44'}}>
                Save And Next
                </Button>

            </div>

        </>
        }
    </>
  )
}


