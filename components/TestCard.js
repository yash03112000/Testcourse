import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import ReactDOM, { unstable_batchedUpdates as unstable } from 'react-dom';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
	Select,
	MenuItem,
	InputLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
	Checkbox,
	Modal,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router';
import { hslToRgb, makeStyles, useTheme } from '@material-ui/core/styles';
import { server } from '../config';
import parse from 'html-react-parser';
import { BorderLeftRounded } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
	main: {
		width: 200,
		height: 300,
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'column',
		boxShadow: '10px 10px 30px silver',
	},
	imgdiv: {
		flex: 1,
		// objectFit: 'cover',
		backgroundColor: 'blue',
		overflow: 'hidden',
	},
	condiv: {
		flex: 1,
		// backgroundColor: 'green',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
	},
	img: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		// maxHeight: 'auto',
	},
	randiv: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		// backgroundColor: 'red',
		justifyContent: 'space-between',
	},
	btn: {
		backgroundColor: '#1A538A',
		// width: 250,
		color: 'white',
		marginBottom: 5,
	},
}));

var confont = 12;

export default function TestCard({ test, router }) {
	const classes = useStyles();
	const [msg, setMsg] = useState('');
	const [load, setLoad] = useState(true);
	const [status, setStatus] = useState(false);

	useEffect(() => {
		initial();
	}, []);

	const initial = () => {
		fetch(`/DashboardServer/permit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid: test._id }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					setStatus(res.status);
					setLoad(false);
				});
			}
		});
	};

	const register = (e) => {
		e.preventDefault();
		fetch(`/payment/test/registerfree`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid: test._id }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					router.reload();
				});
			}
		});
	};

	const pay = (e) => {
		e.preventDefault();
		fetch(`/payment/orders/test`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid: test._id }),
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

								fetch(`/payment/test/success`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ data, testid: test._id }),
								}).then((res) => {
									if (res.status == 400) {
										setMsg('Failure');
									} else {
										setMsg('success');
										router.reload();
									}
								});
							},
							prefill: {
								name: 'Yash Agrawal',
								email: 'SoumyaDey@example.com',
								contact: '9999999999',
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
			}
		});
	};

	const botfun = (test) => {
		if (status) {
			return (
				<>
					<Button
						variant="contained"
						type="submit"
						onClick={() => router.replace(`/test/${test._id}`)}
						className={classes.btn}
						// startIcon={<FacebookIcon />}
					>
						Enter
					</Button>
				</>
			);
		} else {
			if (test.is_free) {
				return (
					<>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{
								color: 'black',
								fontSize: confont,
							}}
						>
							<span
								style={
									{
										// textDecoration: 'line-through',
										// color: 'grey',
									}
								}
							>
								FREE
							</span>
						</Typography>
						<Button
							variant="contained"
							type="submit"
							onClick={register}
							className={classes.btn}
							// startIcon={<FacebookIcon />}
						>
							Register
						</Button>
					</>
				);
			} else {
				if (test.is_on_sale) {
					return (
						<>
							<Typography
								component="span"
								color="primary"
								variant="subtitle1"
								gutterBottom
								style={{
									color: 'black',
									fontSize: confont,
								}}
							>
								<span>&#8377;</span>
								<span
									style={{
										textDecoration: 'line-through',
										color: 'grey',
										margin: 6,
									}}
								>
									{test.price}
								</span>
								<span
									style={
										{
											// textDecoration: 'line-through',
											// color: 'grey',
										}
									}
								>
									{test.sale_price}
								</span>
							</Typography>
							<Button
								variant="contained"
								type="submit"
								onClick={pay}
								className={classes.btn}
								// startIcon={<FacebookIcon />}
							>
								Pay
							</Button>
						</>
					);
				} else {
					return (
						<>
							<Typography
								component="span"
								color="primary"
								variant="subtitle1"
								gutterBottom
								style={{
									color: 'black',
									fontSize: confont,
								}}
							>
								<span
									style={
										{
											// textDecoration: 'line-through',
											// color: 'grey',
										}
									}
								>
									{test.price}
								</span>
							</Typography>
							<Button
								variant="contained"
								type="submit"
								onClick={pay}
								className={classes.btn}
								// startIcon={<FacebookIcon />}
							>
								Pay
							</Button>
						</>
					);
				}
			}
		}
	};

	return load ? (
		<div>Loading...</div>
	) : (
		<div className={classes.main}>
			<div className={classes.imgdiv}>
				<img src="../malefig.jpg" className={classes.img} />
			</div>
			<div className={classes.condiv}>
				<div>
					<div>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{
								color: 'black',
								fontSize: confont,
								fontWeight: 'bolder',
							}}
						>
							{test.title}
						</Typography>
					</div>
					<div className={classes.randiv}>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black', fontSize: confont }}
						>
							Questions:
						</Typography>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black', fontSize: confont }}
						>
							{test.question_id.length}
						</Typography>
					</div>
					<div className={classes.randiv}>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black', fontSize: confont }}
						>
							Time(mins):
						</Typography>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black', fontSize: confont }}
						>
							{test.test_duration}
						</Typography>
					</div>
					<div className={classes.randiv}>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black', fontSize: confont }}
						>
							Maximum Marks:
						</Typography>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black', fontSize: confont }}
						>
							{test.maximum_marks}
						</Typography>
					</div>
					<Divider />
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						// backgroundColor: 'red',
						justifyContent: 'space-around',
						// height: '100%',
					}}
				>
					{botfun(test)}
				</div>
			</div>
		</div>
	);
}
