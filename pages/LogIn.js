import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
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
import FacebookLogin from 'react-facebook-login';

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
	const [msg, setMsg] = useState('');
	const [status, setStatus] = useState(false);
	const router = useRouter();
	const classes = useStyles();
	// console.log(router);
	// console.log(router.query);

	// const googlelgn = () => {
	// 	fetch('/auth/google', {
	// 		method: 'GET',
	// 		// headers: {
	// 		// 	'access-control-allow-origin': 'http://localhost:8080',
	// 		// },
	// 	});
	// };

	const login = (e) => {
		e.preventDefault();
		fetch(`/auth/local`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: Name, password: Password }),
		}).then((res) => {
			// console.log(res.headers['cookie']);
			if (res.status === 200) {
				res.json().then((res) => {
					// console.log(res);
					if (!res.status) {
						setMsg(res.msg);
					} else {
						// console.log(res.accesstoken);
						localStorage.setItem('token', res.accesstoken);
						if (router.query.next) {
							router.replace(router.query.next);
						} else router.replace('/dashboard');
					}
				});
			}
			//  else if (res.status == 403) {
			// 	router.replace('/LogIn');
			// }
		});
	};

	const fblogin = (res) => {
		console.log(res);
	};
	const forget = () => {
		router.push('/Forget');
	};

	return (
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
								<Typography
									component="p"
									color="primary"
									variant="subtitle1"
									gutterBottom
									className={classes.header}
								>
									LogIn To Your TestCourse Account
								</Typography>
								<Divider />
								<div className={classes.btnbox}>
									<Link href="/auth/facebook">
										<Button
											variant="contained"
											type="submit"
											className={classes.fb}
											startIcon={<FacebookIcon />}
										>
											SignIn with FaceBook
										</Button>
									</Link>
									{/* <FacebookLogin
										appId="281662726567615"
										autoLoad={true}
										fields="name,email,picture"
										// onClick={componentClicked}
										callback={fblogin}
										render={(renderProps) => (
											<Button
												variant="contained"
												type="submit"
												className={classes.fb}
												startIcon={<FacebookIcon />}
												// onClick={renderProps.onClick}
											>
												SignIn with FaceBook
											</Button>
										)}
									/> */}
									<Link href="/auth/google">
										<Button
											variant="contained"
											type="submit"
											className={classes.google}
											startIcon={<GTranslateIcon />}
										>
											SignIn with Google
										</Button>
									</Link>
								</div>
								<form onSubmit={login}>
									<div className={styles.btnbox}>
										<TextField
											type="username"
											required
											label="Username"
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
										<TextField
											type="password"
											required
											label="Password"
											name="Password"
											variant="outlined"
											size="small"
											value={Password}
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
									<div>
										<Button
											color="primary"
											variant="contained"
											type="submit"
											style={{}}
											className={classes.submit}
										>
											LogIn
										</Button>
									</div>
								</form>
								<Divider />
								<Typography
									component="h4"
									color="primary"
									variant="subtitle1"
									className={classes.header}
									gutterBottom
								>
									Forget Password?Click
									<span style={{ cursor: 'pointer' }} onClick={forget}>
										Here
									</span>
								</Typography>
								<Typography
									component="h4"
									color="primary"
									variant="subtitle1"
									className={classes.header}
									gutterBottom
								>
									New User?Sign Up <Link href="/SignUp"> Here</Link>
								</Typography>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
