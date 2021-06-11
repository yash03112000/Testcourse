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
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
const useStyles = makeStyles((theme) => ({
	main: {
		display: 'flex',
		flexDirection: 'column',
		width: '100vw',
	},
	head: {
		width: '100%',
		height: '10vh',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'hsl(0,95%,95%)',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
			height: '15vh',
		},
	},
	part1: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'hsl(0,95%,95%)',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 3,
		// backgroundColor: 'red',
		[theme.breakpoints.down('sm')]: {
			// flexDirection: 'column',
			// height: '15vh',
			flex: 1,
		},
	},
	part2: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'hsl(0,95%,95%)',
		justifyContent: 'flex-end',
		alignItems: 'center',
		flex: 1,
		// backgroundColor: 'blue',
	},
	logo: {
		width: '100%',
	},
	course: {
		color: 'black',
	},
	logodiv: {
		flex: 1,
		// backgroundColor: 'red',
		margin: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		cursor: 'pointer',
	},
	coursediv: {
		flex: 0.5,
		display: 'flex',
		flexDirection: 'row',
		// backgroundColor: 'green',
		// padding: 20,
		margin: 5,
	},
	searchdiv: {
		flex: 1.5,
		// backgroundColor: 'green',
		margin: 5,
	},
	cartdiv: {
		flex: 0.1,
		// backgroundColor: 'pink',
		margin: 5,
	},
	btndiv: {
		flex: 1,
		// backgroundColor: 'purple',
		margin: 10,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	login: {
		backgroundColor: 'transparent',
		borderRadius: 0,
		color: 'black',
		margin: 5,
	},
	sign: {
		backgroundColor: 'hsl(0,60%,60%)',
		borderRadius: 0,
		// color: 'black',
		margin: 5,
	},
}));

export default function Home() {
	const classes = useStyles();
	const router = useRouter();
	const [user, setUser] = useState('');
	const [status, setStatus] = useState(false);
	const [load, setLoad] = useState(true);

	useEffect(() => {
		initial();
	}, []);

	const initial = () => {
		// console.log('aa');
		setLoad(true);
		fetch(`/auth/`, { method: 'GET' }).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					setUser(res.user);
					setStatus(true);
				});
			} else if (res.status == 403) setStatus(false);
			setLoad(false);
		});
	};
	const logout = () => {
		// console.log('aa');
		setLoad(true);
		fetch(`/auth/logout`, { method: 'GET' }).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				// res.json().then((res) => {
				// 	setUser(res.user);
				// 	setStatus(true);
				// });
				router.reload();
			}
			// else if (res.status == 403) setStatus(false);
			setLoad(false);
		});
	};

	const but = () => {
		if (!status) {
			return (
				<div className={classes.btndiv}>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{}}
						className={classes.login}
						onClick={() => {
							router.replace('/LogIn');
						}}
					>
						LogIn
					</Button>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{}}
						className={classes.sign}
						onClick={() => {
							router.replace('/SignUp');
						}}
					>
						SignUp
					</Button>
				</div>
			);
		} else {
			return (
				<div className={classes.btndiv}>
					<Typography
						component="p"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.course}
					>
						Hello! {user}
					</Typography>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{}}
						className={classes.login}
						onClick={() => {
							logout();
						}}
					>
						LogOut
					</Button>
				</div>
			);
		}
	};

	return (
		<>
			{load ? (
				<div>Loading..</div>
			) : (
				<div className={classes.head}>
					<div className={classes.part1}>
						<div
							className={classes.logodiv}
							onClick={() => router.replace('/')}
						>
							<img src="/static/logo.png" className={classes.logo} />
						</div>
						<div className={classes.coursediv}>
							<ViewModuleIcon />
							<Typography
								component="p"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.course}
							>
								Courses
							</Typography>
						</div>
						<div className={classes.searchdiv}>
							<TextField
								type="username"
								// required
								label="Search For Courses"
								name="username"
								variant="outlined"
								size="small"
								style={{ width: '100%' }}
								// value={Name}
								// onChange={(e) => setName(e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<SearchIcon />
										</InputAdornment>
									),
								}}
							/>
						</div>
					</div>
					<div className={classes.part2}>
						{/* <div className={classes.cartdiv}>
							<Badge badgeContent="0" color="primary">
								<ShoppingCartIcon />
							</Badge>
						</div> */}
						{but()}
					</div>
				</div>
			)}
		</>
	);
}
