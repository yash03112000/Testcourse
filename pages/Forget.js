import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
	msg: {
		color: 'red',
		fontWeight: 'bold',
		fontSize: 15,
	},
	header: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 10,
	},
	fb: {
		backgroundColor: '#1A538A',
		width: 250,
		color: 'white',
		marginBottom: 5,
	},
	google: {
		backgroundColor: '#fff',
		width: 250,
		color: 'black',
	},
	submit: {
		backgroundColor: '#A436F1',
		width: 250,
		color: 'black',
		marginTop: 20,
	},
	main: {
		// backgroundColor:'green',
		width: 250,
	},
	btnbox: {
		display: 'flex',
		flexDirection: 'column',
		marginTop: 20,
		marginBottom: 10,
	},
}));

export default function Home() {
	const [Name, setName] = useState('');
	const [Password, setPassword] = useState('');
	const [otp, setOTP] = useState('');
	const [msg, setMsg] = useState('');
	const [load, setLoad] = useState(false);
	const router = useRouter();
	const classes = useStyles();
	// console.log(router);
	// console.log(router.query);

	const login = async (e) => {
		e.preventDefault();
		if (load) {
			if (Name === '') {
				setMsg('Please fill Email Detail');
			} else {
				const res = await axios.post(`/auth/forget`, { email: Name });
				if (res.data.status === 404) {
					setMsg(res.data.msg);
				} else {
					setLoad(false);
				}
			}
		} else {
			if (password === '' || OTP === '' || Name === '') {
				setMsg('Please fill Email Detail');
			} else {
				const res = await axios.post(`/auth/forget/set`, {
					otp,
					password,
					email: Name,
				});
				if (res.data.status === 404) {
					setMsg(res.data.msg);
				} else {
					setMsg('Password Changed');
					router.replace('/LogIn');
				}
			}
		}
	};

	return load ? (
		<div>Loading..</div>
	) : (
		<div className={styles.container}>
			<Head>
				<title>TestCourse</title>
			</Head>

			<main className={styles.main}>
				<div className="container">
					<div className="row">
						<div className="col-8">
							<div className={styles.mainform}>
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.msg}
								>
									{msg}
								</Typography>
								{/* <Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.header}
								>
									New Password is sent to your email id
								</Typography> */}
								<Divider />
								<form onSubmit={login}>
									<div className={styles.btnbox}>
										<TextField
											type="email"
											required
											label="Email"
											name="username"
											variant="outlined"
											size="small"
											autoFocus
											value={Name}
											onChange={(e) => setName(e.target.value)}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<MailOutlineIcon />
													</InputAdornment>
												),
											}}
										/>
										{load ? (
											<div>
												<TextField
													type="passowrd"
													required
													label="OTP"
													name="password"
													variant="outlined"
													size="small"
													autoFocus
													value={otp}
													onChange={(e) => setOTP(e.target.value)}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<LockIcon />
															</InputAdornment>
														),
													}}
												/>
												<TextField
													type="passowrd"
													required
													label="New Password"
													name="password"
													variant="outlined"
													size="small"
													autoFocus
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<LockIcon />
															</InputAdornment>
														),
													}}
												/>
											</div>
										) : (
											<></>
										)}
									</div>
									<div>
										<Button
											color="primary"
											variant="contained"
											type="submit"
											style={{}}
											className={classes.submit}
										>
											Advance
										</Button>
									</div>
								</form>
								<Divider />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
