import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React, {useState} from 'react';
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '../components/Drawer'
import RightDiv from '../components/RightDiv'
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
        padding:8
    }
}));

export default function Home() {
  const [lang,setLang] = useState('');
  const [status,setStatus] = useState(false);
//   const [drawer,setDrawer] = useState(false);
  const router = useRouter()
  const classes = useStyles();


  const googlelgn = ()=>{
    fetch('/auth/google',{method:'GET'})
  }






  const login=(e)=>{
      e.preventDefault();
      fetch(`/auth/SignUp`, {method: 'POST',headers: {
          'Content-Type': 'application/json'}, body: JSON.stringify({username:Name,password:Password})})
          .then(res => {
              if(res.status === 200){
                res.json().then((res)=>{
                  if(res.msg === "Username Exist"){
                    setMsg(res.msg)
                  }else{
                    router.replace('/dashboard');
                 }
                })
              }
          })

    }
  return (
    <div >
      <Head>
        <title>TestCourse</title>
      </Head>

      <main>
              <div className= {classes.mainform}>
                <div className={classes.header}>
                    <div>
                        <Typography component="span" color="primary" variant="subtitle1" gutterBottom className={classes.headertext} >
                        ABCD Test
                        </Typography>
                    </div>
                    <div className={classes.headertextInstruct}>
                        <Typography component="div" align="right" color="primary" variant="subtitle1" gutterBottom style={{color:'white'}} >
                        View Instructions
                        </Typography>
                    </div>
                    <Drawer />
                    {/* <MenuIcon className={classes.hamicon} /> */}

                </div>
                <div className={classes.maindiv}>
                    <div className={classes.maindivleft}>
                        <div className={classes.sec1}>
                            <div style={{padding:5}}>  
                                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'#38A9EB',color:'white',padding:8,margin:10,borderRadius:10}} >
                                General Awareness
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.sec2}>
                            <div>
                                <div>
                                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',margin:5}} >
                                    Section
                                    </Typography>
                                </div>
                            </div>
                            <div>        
                                <div>
                                    <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',margin:5}} >
                                    Time Left:00:00
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className={classes.sec3}>
                            <div>
                                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'#38A9EB',color:'white',padding:8,margin:10}} >
                                General Awareness
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.sec4}>
                            <div>
                                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'red',padding:8,margin:5}} >
                                Question Type : MCQ
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
                        <div className={classes.sec6}>
                            <div>
                                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',padding:8}} >
                                    Mr Donald Reagan was _______
                                </Typography>
                                <RadioGroup aria-label="quiz" name="quiz" style={{color:'black',padding:8}}>
                                    <FormControlLabel value="a" control={<Radio />} label="A" />
                                    <FormControlLabel value="b" control={<Radio />} label="B" />
                                    <FormControlLabel value="c" control={<Radio />} label="C" />
                                    <FormControlLabel value="d" control={<Radio />} label="D" />
                                </RadioGroup>
                            </div>
                        </div>
                        <div>
                            
                        </div>
                        <div></div>
                    </div>
                    <RightDiv/>
                    </div>
                    <div style={{width:'100vw',display:'flex',flexDirection:'row'}}>
                        <div style={{flex:3}}>
                            <Button variant="contained">
                            Mark For Review and Next
                            </Button>
                            <Button variant="contained">
                            Clear Response
                            </Button>
                            <Button variant="contained">
                            Save and Next
                            </Button>
                        </div>
                        <div style={{flex:1}}>
                            <Button variant="contained" disabled>
                                Submit
                            </Button>
                        </div>
                    </div>
               </div> 
      </main>
    </div>
  )
}
