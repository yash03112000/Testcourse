import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React, {useState} from 'react';
import {TextField,Button,Typography,Divider,InputAdornment} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { GetStaticProps } from 'next'
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles((theme) => ({
  msg:{
    color:'red',
    fontWeight:'bold',
    fontSize:15
  },
    header:{
      color:'black',
      fontWeight:'bold',
      fontSize:10
    },
    fb:{
      backgroundColor:'#1A538A',
      width:250,
      color:'white',
      marginBottom:5
    },
    google:{
      backgroundColor:'#fff',
      width:250,
      color:'black'
    },
    submit:{
      backgroundColor:'#A436F1',
      width:250,
      color:'black',
      marginTop:20
    },
    main:{
      // backgroundColor:'green',
      width:250
    },
    btnbox:{  
      display:'flex',
      flexDirection: 'column',
      marginTop:20,
      marginBottom:10
    }
}));

export default function Home() {
  const [Name,setName] = useState('');
  const [Msg,setMsg] = useState('');
  const [Password,setPassword] = useState('');
  const [status,setStatus] = useState(false);
  const router = useRouter()
  const classes = useStyles();









  const pay=(e)=>{
      e.preventDefault();
      fetch(`/payment/orders`, {method: 'POST',headers: {
          'Content-Type': 'application/json'}, body: JSON.stringify()})
          .then(res => {
              if(res.status === 200){
                res.json().then((res)=>{
                  if(res.status){
                    const { amount, id: order_id, currency } = res.order;
                    const options = {
                      key: "rzp_test_PkwJH5RLbw6ZnE", // Enter the Key ID generated from the Dashboard
                      amount: amount.toString(),
                      currency: currency,
                      name: "Soumya Corp.",
                      description: "Test Transaction",
                      // image: { logo },
                      order_id: order_id,
                      handler: async function (response) {
                          const data = {
                              orderCreationId: order_id,
                              razorpayPaymentId: response.razorpay_payment_id,
                              razorpayOrderId: response.razorpay_order_id,
                              razorpaySignature: response.razorpay_signature,
                          };
          
                          fetch(`/payment/success`, {method: 'POST',headers: {
                            'Content-Type': 'application/json'}, body: JSON.stringify({data})})
                            .then((res)=>{
                              if(res.status==400){
                                setMsg('Failure')
                              }else{
                                setMsg('success')
                              }
                            })
          
                      },
                      prefill: {
                          name: "Yash Agrawal",
                          email: "SoumyaDey@example.com",
                          contact: "9999999999",
                      },
                      notes: {
                          address: "Yash",
                      },
                      theme: {
                          color: "#61dafb",
                      },
                  };
          
                  const paymentObject = new window.Razorpay(options);
                  paymentObject.open();
                  }
                })
              }
          })

    }
  return (
    <div className={styles.container}>
      <Head>
        <title>TestCourse</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>

      <main className={styles.main}>
        <h1>Dashboard</h1>
        <Link href={`/test/608470b2649f1c577703ea58`}>Test Link</Link>
        {<Typography component="p" color="primary" variant="subtitle1" gutterBottom className={classes.msg} >
          {Msg}
        </Typography>
        }
        <Button  variant="contained" type="submit"  onClick={pay} className={classes.fb} startIcon={<FacebookIcon />} >Pay</Button>
      </main>
    </div>
  )
}

