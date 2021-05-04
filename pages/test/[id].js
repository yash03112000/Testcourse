import Head from 'next/head'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import React, {useState} from 'react';
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '../../components/Drawer'
import RightDiv from '../../components/RightDiv'
import Question from '../../components/Question'
import { server } from '../../config';

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

export default function Home({test,results}) {
  const [lang,setLang] = useState('');
  const [status,setStatus] = useState(false);
  const [data,setData] = useState(test);
  const [result,setResult] = useState(results);
  const [section,setSection] = useState(test.section_id[0]);
  const [quesid,setQuesid] = useState(test.question_id[section.startindex]);
//   const [sanswer,setSanswer] = useState('')
//   const [manswer,setManswer] = useState([]);
  const router = useRouter()
  const classes = useStyles();

//   console.log(data)

    const changeqid= (id)=>{
        if(quesid!==id) setQuesid(id);
    }
    const secChange= (curr)=>{
        if(curr.title!==section.title){
            setSection(curr);
            setQuesid(data.question_id[curr.startindex])
        } 
    }
    const changeresult= (result,id)=>{
        var i =0;
        for(i=0;i<result.user_response.length;i++){
            if(result.user_response[i]._id === id){
                if(i!==section.endindex){
                    setQuesid(result.user_response[i+1]._id)
                }
            }
        }
        setResult(result);
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
                        {data.title}
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
                            {data.section_id.map((sec,index)=>{
                                return (
                                    <div style={{padding:5}} key={index} onClick={()=>{secChange(sec)}}>  
                                        <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'#38A9EB',color:'white',padding:8,margin:10,borderRadius:10}} >
                                        {sec.title}
                                        </Typography>
                                    </div>
                                )
                            })}

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
                                {section.title}
                                </Typography>
                            </div>
                        </div>
                        <Question id={quesid} changeresult={changeresult} result={result} />
                    </div>
                    <RightDiv result={result} changeqid={changeqid} section={section}  />
                    </div>
               </div> 
      </main>
    </div>
  )
}


export async function getServerSideProps(ctx) {
    // console.log(server)
    var res = await fetch(`${server}/Testserver/${ctx.params.id}`,{method:"GET",headers: ctx.req ? { cookie: ctx.req.headers.cookie,'User-Agent': '*' } : undefined});
    // if(res.status===404){
    //     return {
    //         redirect: {
    //           destination: '/404',
    //           permanent: false,
    //         },
    //       }
    // }
    var data = await res.json();
    var test = data.test;
    var result = data.result


    // var data = 'a';

    // console.log(data);
    
    return {
      props: {test,results:result}, // will be passed to the page component as props
    }
  }