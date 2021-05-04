import Head from 'next/head'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import React, {useState,useEffect} from 'react';
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel,Checkbox} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { server } from '../config';
import parse from 'html-react-parser';
const useStyles = makeStyles((theme) => ({

    mainform:{
        width:'100vw',
        display:'flex',
        flexDirection:'column'
    },
    header:{
        backgroundColor:'#363636',
        width:'100vw',
        display:'flex',
        flexDirection:'row',
        justifyContent:"space-between"
    },
    headertext:{
        color:'#D8EA4D',
        fontSize:12
    },
    headertextInstruct:{
        // justifySelf:'center',
        // backgroundColor:'red'
    },
    maindiv:{
        height:550,
        width:"100vw",
        display:'flex',
        flexDirection:'row',
        justifyContent:"space-between"
    },
    maindivleft:{
        flex:3,
        // backgroundColor:'red',
        display:'flex',
        flexDirection:'column'
    },
    sec1:{
        height:50,
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

export default function Question({id,changeresult,result}) {
  const [lang,setLang] = useState('');
  const [loading,setLoading] = useState(true);
  const [ques,setQues] = useState({});
  const [answer,setAnswer] = useState([])
//   const [manswer,setManswer] = useState([]);
  const router = useRouter()
  const classes = useStyles();
  const {id:test} = router.query;

  useEffect(()=>{
      initial();
  },[id])

  const initial = ()=>{
      setLoading(true);
    fetch(`${server}/Testserver/question`, {method: 'POST',headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({id,test})})
        .then(res => {
            // console.log(res.status)
            if(res.status === 200){
              res.json().then((res)=>{
                // console.log(res)
                setQues(res.quesbody)
                setAnswer(res.ques.response)
                changeresult(res.result)
                setLoading(false)
              })
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
                changeresult(res.result,id)
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
                    setAnswer([])
                    changeresult(res.result,id)
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
                    changeresult(res.result,id)
                    })
                }
            })
        }   



  const qtype = (ques)=>{
      if(ques.question_type === 'SCQ'){
          return (
            <div className={classes.sec7}>
                <div style={{margin:10}}>

                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black'}} >
                        {parse(ques.question)}
                    </Typography>
                    <RadioGroup aria-label="quiz" name="quiz" style={{color:'black',padding:8}}  defaultValue={answer[0]} value={answer[0]} onChange={(e)=>{setAnswer([e.target.value])}} >
                        {ques.option_1.valid?<FormControlLabel value={ques.option_1._id} control={<Radio />} label={parse(ques.option_1.content)} />:<></>}
                        {ques.option_2.valid?<FormControlLabel value={ques.option_2._id} control={<Radio />} label={parse(ques.option_2.content)} />:<></>}
                        {ques.option_3.valid?<FormControlLabel value={ques.option_3._id} control={<Radio />} label={parse(ques.option_3.content)} />:<></>}
                        {ques.option_4.valid?<FormControlLabel value={ques.option_4._id} control={<Radio />} label={parse(ques.option_4.content)} />:<></>}
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
        return (
            <div className={classes.sec7}>
                <div style={{margin:10}}>
                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black'}} >
                        {parse(ques.question)}
                    </Typography>
                    <TextField  type="username" required label="Username" name="username" variant="outlined" size="small" autoFocus defaultValue={answer[0]} value={answer[0]} onChange={(e)=>{setAnswer([e.target.value])}}   InputProps={{
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
            <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{flex:3}}>
                    <Button variant="contained" onClick={review}>
                    Mark For Review
                    </Button>
                    <Button variant="contained" onClick={clearresponse}>
                    Clear Response
                    </Button>
                    <Button variant="contained" onClick={savefun}>
                    Save
                    </Button>
                </div>
                <div style={{flex:1}}>
                    <Button variant="contained" disabled>
                        Submit
                    </Button>
                </div>
            </div>

        </>
        }
    </>
  )
}


