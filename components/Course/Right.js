// import Head from 'next/head';
// import Link from 'next/link';
// import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
	Badge,
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PersonIcon from '@material-ui/icons/Person';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
const useStyles = makeStyles((theme) => ({
	main: {
		flex: 1,
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 20,
		border: '0.2px solid rgba(0,0,0,0.2)',
		padding: 10,
		borderRadius: 5,
	},
	head: {
		color: 'black',
		fontSize: 20,
		fontWeight: 'bold',
		padding: 5,
	},
	text: {
		color: 'black',
		// padding: 10,
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		// backgroundColor: 'red',
		alignItems: 'center',
		// justifyContent: 'center',
	},
	column: {
		display: 'flex',
		flexDirection: 'column',
		// paddingLeft: 30,
		// backgroundColor: 'red',
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	card: {
		// height: '60vh',
		// backgroundColor: 'red',
		width: '90%',
		boxShadow: '10px 10px 30px silver',
	},
	imgdiv: {
		height: 200,
	},
	img: {
		height: '100%',
		width: '100%',
		objectFit: 'co',
	},
	pricetext: {
		color: 'black',
		padding: 10,
		fontSize: 25,
	},
	rest: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
}));

export default function Home({ data }) {
	const router = useRouter();
	const classes = useStyles();
	const [load, setLoad] = useState(true);
	const [status, setStatus] = useState(false);
	const [fresh, setFresh] = useState([]);
	const [msg, setMsg] = useState('');
	const { id } = router.query;

	useEffect(() => {
		initial();
	}, []);

	const initial = () => {
		fetch(`/CourseServer/permit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					setStatus(res.status);
					setFresh(res.data);
					setLoad(false);
				});
			}
		});
	};

	const register = (e) => {
		e.preventDefault();
		fetch(`/payment/course/registerfree`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
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
		// console.log('aa');
		e.preventDefault();
		fetch(`/payment/orders/course`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
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
							description: 'Course Transaction',
							// image: { logo },
							order_id: order_id,
							handler: async function (response) {
								const data = {
									orderCreationId: order_id,
									razorpayPaymentId: response.razorpay_payment_id,
									razorpayOrderId: response.razorpay_order_id,
									razorpaySignature: response.razorpay_signature,
								};

								fetch(`/payment/course/success`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ data, id }),
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
					<div className={classes.row}>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.pricetext}
						>
							<span
								style={{
									// textDecoration: 'line-through',
									// color: 'grey',
									fontWeight: 'bolder',
								}}
							>
								FREE
							</span>
						</Typography>
					</div>
					<div className={classes.rest}>
						<Button
							style={{
								backgroundColor: 'hsl(0,60%,60%)',
								width: '80%',
								paddingTop: 15,
								paddingBottom: 15,
								borderRadius: 0,
								margin: 10,
								// border: '0.2px solid black',
							}}
							// onClick={pay}
						>
							Enter
						</Button>
					</div>
				</>
			);
		} else {
			if (fresh.is_free) {
				return (
					<>
						<div className={classes.row}>
							<Typography
								component="p"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.pricetext}
							>
								<span
									style={{
										// textDecoration: 'line-through',
										// color: 'grey',
										fontWeight: 'bolder',
									}}
								>
									FREE
								</span>
							</Typography>
						</div>
						<div className={classes.rest}>
							<Button
								style={{
									backgroundColor: 'hsl(0,60%,60%)',
									width: '80%',
									paddingTop: 15,
									paddingBottom: 15,
									borderRadius: 0,
									margin: 10,
									// border: '0.2px solid black',
								}}
								onClick={pay}
							>
								Buy Now
							</Button>
						</div>
					</>
				);
			} else {
				if (fresh.is_on_sale) {
					return (
						<>
							<div className={classes.row}>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.pricetext}
								>
									<span>&#8377;</span>
									<span
										style={{
											textDecoration: 'line-through',
											color: 'grey',
											margin: 20,
										}}
									>
										{fresh.price}
									</span>
									<span
										style={{
											// textDecoration: 'line-through',
											// color: 'grey',
											fontWeight: 'bolder',
										}}
									>
										{fresh.sale_price}
									</span>
								</Typography>
							</div>
							<div className={classes.rest}>
								<Button
									style={{
										backgroundColor: 'hsl(0,60%,60%)',
										width: '80%',
										paddingTop: 15,
										paddingBottom: 15,
										borderRadius: 0,
										margin: 10,
										// border: '0.2px solid black',
									}}
									onClick={pay}
								>
									Buy Now
								</Button>
							</div>
						</>
					);
				} else {
					return (
						<>
							<div className={classes.row}>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.pricetext}
								>
									<span>&#8377;</span>
									<span
										style={{
											// textDecoration: 'line-through',
											// color: 'grey',
											margin: 20,
										}}
									>
										{fresh.price}
									</span>
								</Typography>
							</div>
							<div className={classes.rest}>
								<Button
									style={{
										backgroundColor: 'hsl(0,60%,60%)',
										width: '80%',
										paddingTop: 15,
										paddingBottom: 15,
										borderRadius: 0,
										margin: 10,
										// border: '0.2px solid black',
									}}
									onClick={pay}
								>
									Buy Now
								</Button>
							</div>
						</>
					);
				}
			}
		}
	};

	return (
		<div className={classes.main}>
			<div className={classes.card}>
				{load ? (
					<div>Loading...</div>
				) : (
					<>
						<div className={classes.imgdiv}>
							<img src="/static/banner.jpg" className={classes.img} />
						</div>
						<div className={classes.column}>
							{botfun()}
							<div className={classes.column} style={{ paddingLeft: 20 }}>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.head}
								>
									Includes
								</Typography>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.text}
								>
									23 Hours
								</Typography>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.text}
								>
									24 Lessons
								</Typography>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.text}
								>
									Access
								</Typography>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.text}
								>
									Full Time
								</Typography>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

{
	/* <div className={classes.column}>
					<div className={classes.row}>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.pricetext}
						>
							<span>&#8377;</span>
							<span
								style={{
									textDecoration: 'line-through',
									color: 'grey',
									margin: 20,
								}}
							>
								123
							</span>
							<span
								style={{
									// textDecoration: 'line-through',
									// color: 'grey',
									fontWeight: 'bolder',
								}}
							>
								100
							</span>
						</Typography>
					</div>
					<div className={classes.rest}>
						<Button
							style={{
								backgroundColor: '#7E57C2',
								width: '80%',
								paddingTop: 15,
								paddingBottom: 15,
								borderRadius: 0,
								margin: 10,
								// border: '0.2px solid black',
							}}
						>
							Add to wishlist
						</Button>
						<Button
							style={{
								backgroundColor: 'hsl(0,60%,60%)',
								width: '80%',
								paddingTop: 15,
								paddingBottom: 15,
								borderRadius: 0,
								margin: 10,
								// border: '0.2px solid black',
							}}
						>
							Buy Now
						</Button>
						<Button
							style={{
								backgroundColor: '#FFF',
								width: '80%',
								paddingTop: 15,
								paddingBottom: 15,
								borderRadius: 0,
								margin: 10,
								border: '0.2px solid black',
							}}
						>
							Add to Cart
						</Button>
					</div
				</div> */
}
