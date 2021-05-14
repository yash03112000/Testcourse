import Head from 'next/head'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import React, {useState,useEffect} from 'react';
import ReactDOM,{unstable_batchedUpdates as unstable} from "react-dom";
import {TextField,Button,Typography,Divider,InputAdornment,Select,MenuItem,InputLabel,Radio,RadioGroup,FormControlLabel,Modal,Backdrop,Fade} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { server } from '../../config';
import { ResponsivePie } from '@nivo/pie'

const useStyles = makeStyles((theme) => ({
    mainform:{
        width:'100vw',
        display:'flex',
        flexDirection:'column',
        // height:'100vh'
    },
    header:{
        display:'flex',
        justifyContent:'center',
        padding:30
    },
    graph:{
        height:'60vh'
    },
    tr1:{
        backgroundColor:'hsl(240,74%,66%)',
    },
    table:{
        width:'60vw',
        backgroundColor:'hsl(201,87%,63%)',
    },
    tablediv:{
        width:'100vw',
        display:'flex',
        justifyContent:'center'
    }

}));

export default function Home({data}) {
  const [lang,setLang] = useState('');
  const [load,setLoad] = useState(true);
  const [piedata,setPieData] = useState([]);
  const [sec,setSec] = useState(data.sections[0]);
  const [color,setColors] = useState(["hsl(260, 70%, 50%)","hsl(100, 70%, 50%)","hsl(343, 70%, 50%)","hsl(75, 70%, 50%)","hsl(259, 70%, 50%)"]);

  const router = useRouter()
  const classes = useStyles();




  useEffect(()=>{
      datafun()
  },[])

  const datafun = ()=>{
    var a = [];
    console.log(data)
    data.sections.map((sec,i)=>{
        var b = {}
        b.id = sec.title;
        // b.title = sec.title;
        b.value = sec.score;
        b.index = i;
        b.color = color[(i%color.length)];
        a.push(b)
    })
    unstable(()=>{
        setPieData(a)
        setLoad(false)

    })
}

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
        let total = 0
        dataWithArc.forEach(datum => {
            total += datum.value
        })

        return (
            <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    fontSize: '40px',
                    fontWeight: '600',
                }}
            >
                {total}
            </text>
        )
}

  return (
    load?<h1>Loading..</h1>:
    <div >
      <Head>
        <title>Result</title>
      </Head>

      <main>
          <div className= {classes.mainform}>
              <div className={classes.header}>
                <Typography style={{fontSize:40,}} >
                    Your Result is ...
                </Typography>
              </div>
              <div className={classes.graph}>
                <ResponsivePie
                    data={piedata}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 140,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                    layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
                    onClick={(node,event)=>{setSec(data.sections[node.data.index])}}
                />
              </div>
          </div>
          <div className={classes.tablediv}>
              <table className={classes.table}>
                  <tr className={classes.tr1}>
                      <th colSpan={2}>
                        <Typography>
                            {sec.title}
                        </Typography>
                      </th>
                  </tr>
                  <tr>
                      <td>
                        <Typography>
                            Total Question
                        </Typography>
                      </td>
                      <td>
                        <Typography>
                            {sec.endindex-sec.startindex+1}
                        </Typography>
                      </td>
                  </tr>
                  <tr>
                      <td>
                        <Typography>
                            Attempted
                        </Typography>
                      </td>
                      <td>
                        <Typography>
                            {sec.attempt}
                        </Typography>
                      </td>
                  </tr>                  
                  <tr>
                      <td>
                        <Typography>
                            Correct Answers
                        </Typography>
                      </td>
                      <td>
                        <Typography>
                            {sec.correct}
                        </Typography>
                      </td>
                  </tr>
                  <tr>
                      <td>
                        <Typography>
                            Wrong Answers
                        </Typography>
                      </td>
                      <td>
                        <Typography>
                            {sec.attempt - sec.correct}
                        </Typography>
                      </td>
                  </tr>
              </table>
          </div>


      </main>
    </div>
  )
}


export async function getServerSideProps(ctx) {
    // console.log(server)
    var res = await fetch(`${server}/Testserver/result/${ctx.params.id}`,{method:"GET",headers: ctx.req ? { cookie: ctx.req.headers.cookie,'User-Agent': '*' } : undefined});
    // if(res.status===404){
    //     return {
    //         redirect: {
    //           destination: '/404',
    //           permanent: false,
    //         },
    //       }
    // }
    var data = await res.json();
    // var test = data.test;
    // var result = data.result
    // var arr = [];

    // result.user_response.map((res,i)=>{
    //     var a = {};
    //     a['done'] = false;
    //     a['_id'] = res._id;
    //     a['content'] = {};
    //     // a['response'] = []
    //     arr.push(a);
    // })

    // console.log(result);

    var a = data.result;




    
    return {
      props: {data:a}, // will be passed to the page component as props
    }
  }