import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel} from '@material-ui/core';


const useStyles = dis=>makeStyles((theme)=>({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  hamicon:{
      color:'#38A9EB',
      [theme.breakpoints.up('sm')]:{
          display:'none'
      },
      padding:0,
  },
  rightsec1:{
      display:'flex',
      flexDirection:'row',
      // justifyContent:'flex-end',
      backgroundColor:'#F8FBFF'
  },
  rightsec2:{
      display:'flex',
      flexDirection:'column',
      // justifyContent:'flex-end',
      backgroundColor:'#fff'
  },
  rightsec3:{
      display:'flex',
      flexDirection:'row',
      // justifyContent:'flex-end',
      backgroundColor:'#4E85C5'
  },
  rightsec4:{
      display:'flex',
      flexDirection:'column',
      // justifyContent:'flex-end',
      backgroundColor:'#E5F6FD',
      height:300
  },
  maindivright:{
      flex:1,
      // backgroundColor:'blue',
      display:'flex',
      flexDirection:'column',
      [theme.breakpoints.down('sm')]:{
          display:'block'
      }
  }
}));

export default function RightDivDrawer() {
    // console.log(dis)
  const classes = useStyles();

  return(
    <div className={classes.maindivright}> 
    <div className={classes.rightsec1}>
        <img src="./malefig.jpg" height="100" style={{margin:10,borderRadius:10}} />
        <div>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom  style={{color:'black',fontSize:18}}>
            John Doe
            </Typography>
        </div>

    </div>
    <div className={classes.rightsec2}>
        <div style={{display:'flex',flexDirection:'row',margin:10,padding:3}}>
            <div>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:10,borderRadius:15}}>
                0
                </Typography>
                <Typography component="span" color="primary" variant="subtitle1"  gutterBottom style={{color:'black',margin:10,fontSize:14}}>
                Answered
                </Typography>
            </div>
            <div>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'red',color:'white',padding:10,borderRadius:15}}>
                0
                </Typography>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',margin:10,fontSize:14}}>
                Not Answered
                </Typography>
            </div>
        </div>
        <div style={{display:'flex',flexDirection:'row',margin:10,padding:3}}>
            <div>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'white',color:'black',padding:10,borderRadius:15}}>
                0
                </Typography>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',margin:10,fontSize:14}}>
                Not Visited
                </Typography>
            </div>
            <div>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'purple',color:'white',padding:10,borderRadius:15}}>
                0
                </Typography>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',margin:10,fontSize:14}}>
                Marked For Review
                </Typography>
            </div>
        </div>
        <div style={{display:'flex',flexDirection:'row',margin:10,padding:3}}>
            <div>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'purple',color:'white',padding:10,borderRadius:15}}>
                0
                </Typography>
                <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',margin:10,fontSize:14}}>
                Answered And Marked for Review
                </Typography>
            </div>
        </div>


    </div>
    <div className={classes.rightsec3}>
        <div>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'white',margin:5,padding:5}} >
            General Awarness
            </Typography>
        </div>
    </div>
    <div className={classes.rightsec4}>
        <div>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{color:'black',fontSize:13,margin:5 }} >
            Choose a Question
            </Typography>
        </div>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',maxHeight:'100%',overflow:'scroll'}}>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>                                
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>                                
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>                                
            <Typography component="span" color="primary" variant="subtitle1" gutterBottom style={{backgroundColor:'green',color:'white',padding:15,borderRadius:15,margin:5}}>
                0
            </Typography>
        </div>

        </div>
    </div>
  )
}
