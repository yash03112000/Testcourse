import Head from 'next/head'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import React, {useState,useEffect} from 'react';
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel} from '@material-ui/core';
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

export default function Home({id}) {
  const [lang,setLang] = useState('');
  const [loading,setLoading] = useState(true);
  const [ques,setQues] = useState({});
  const router = useRouter()
  const classes = useStyles();

  useEffect(()=>{
      initial();
  },[])

  const initial = ()=>{
    fetch(`${server}/Testserver/question`, {method: 'POST',headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({id})})
        .then(res => {
            console.log(res.status)
            if(res.status === 200){
              res.json().then((res)=>{
                console.log(res)
                setQues(res.ques)
                setLoading(false)
              })
            }
        })
  }

  const domelement = (str)=>{
    // var parser = new DOMParser();
	// var doc = parser.parseFromString(str, 'text/html');
    // console.log(doc.body)
	// return doc.body;
    return { __html: str };
  }

  const qtype = (ques)=>{
      if(ques.question_type === 'SCQ'){
          return (
            <div className={classes.sec7}>
                <div style={{margin:10}}>

                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black'}} >
                        {parse(ques.question)}
                    </Typography>
                    <RadioGroup aria-label="quiz" name="quiz" style={{color:'black',padding:8}}>
                        {ques.option_1.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_1.content)} />:<></>}
                        {ques.option_2.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_2.content)} />:<></>}
                        {ques.option_3.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_3.content)} />:<></>}
                        {ques.option_4.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_4.content)} />:<></>}
                        {/* {ques.option_5.valid?<FormControlLabel value="a" control={<Radio />} label={parse(ques.option_5.content)} />:<></>} */}
                    </RadioGroup>
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
                    Question NO :1
                    </Typography>
                </div>
            </div>
            {qtype(ques)}

        </>
        }
    </>
  )
}


