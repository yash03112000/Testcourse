import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
} from '@material-ui/core';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
// import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import FacebookIcon from '@material-ui/icons/Facebook';
// import GTranslateIcon from '@material-ui/icons/GTranslate';

export default function Home() {
	const [load, setLoad] = useState(true);
	const router = useRouter();
	const { id: testid } = router.query;

	// useEffect(() => {
	// 	initial();
	// }, []);

	// console.log(testid)

	const pay = () => {
		// e.preventDefault();
		fetch(`/payment/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid }),
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status) {
						const { amount, id: order_id, currency } = res.order;
						const options = {
							key: 'rzp_test_PkwJH5RLbw6ZnE', // Enter the Key ID generated from the Dashboard
							amount: amount.toString(),
							currency: currency,
							name: 'Soumya Corp.',
							description: 'Test Transaction',
							// image: { logo },
							order_id: order_id,
							handler: async function (response) {
								const data = {
									orderCreationId: order_id,
									razorpayPaymentId: response.razorpay_payment_id,
									razorpayOrderId: response.razorpay_order_id,
									razorpaySignature: response.razorpay_signature,
								};

								fetch(`/payment/success`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ data, testid: test._id }),
								}).then((res) => {
									if (res.status == 400) {
										setMsg('Failure');
									} else if (res.status == 403) {
										router.push('/LogIn');
									} else {
										setMsg('success');
										router.reload();
									}
								});
							},
							prefill: {
								name: 'Yash Agrawal',
								email: 'SoumyaDey@example.com',
								contact: '8529174350',
							},
							notes: {
								address: 'Yash',
							},
							theme: {
								color: '#61dafb',
							},
						};

						const paymentObject = new window.Razorpay(options);
						paymentObject.open();
					}
				});
			} else if (res.status == 403) {
				router.push('/LogIn');
			}
		});
	};
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<Head>
				<title>TestCourse</title>
				<script src="https://checkout.razorpay.com/v1/checkout.js" />
			</Head>
			<Button onClick={pay}>Pay</Button>
		</div>
	);
}
