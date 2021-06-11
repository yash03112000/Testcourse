// import Head from 'next/head';
// import Link from 'next/link';
// import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
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

const useStyles = makeStyles((theme) => ({
	head: {
		width: '100vw',
		// height: 80,
		display: 'flex',
		flexDirection: 'row',
		marginTop: 40,
		backgroundColor: 'hsl(0,95%,95%)',
		justifyContent: 'space-between',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
			// height: '15vh',
			flex: 1,
			justifyContent: 'center',
			// alignContent: 'center',
		},

		// backgroundColor: 'red',
	},
	part1: {
		display: 'flex',
		flexDirection: 'row',
		width: '25vw',
		// margin: 5,
		// backgroundColor: 'red',
		[theme.breakpoints.down('sm')]: {
			// flexDirection: 'column',
			// height: '15vh',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},
	},
	logodiv: {
		// backgroundColor: 'red',
		margin: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
	},
	logo: {
		width: '100%',
		height: '100%',
		objectFit: 'contain',
	},
	part2: {
		display: 'flex',
		flexDirection: 'row',
		margin: 15,
	},
	linkdiv: {
		margin: 5,
	},
	course: {
		color: 'black',
	},
}));

export default function Home() {
	// const router = useRouter();
	const classes = useStyles();

	return (
		<div className={classes.head}>
			<div className={classes.part1}>
				<div className={classes.logodiv}>
					<img src="/static/logo.png" className={classes.logo} />
				</div>
				<div className={classes.logodiv}>
					<Typography
						component="p"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.course}
					>
						About
					</Typography>
				</div>
			</div>
			<div className={classes.part2}>
				<div className={classes.linkdiv}>
					<Typography
						component="p"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.course}
					>
						Privacy Policy
					</Typography>
				</div>
				<div className={classes.linkdiv}>
					<Typography
						component="p"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.course}
					>
						Terms and condition
					</Typography>
				</div>
				{/* <div className={classes.linkdiv}>
					<Typography
						component="p"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.course}
					>
						Login
					</Typography>
				</div> */}
			</div>
		</div>
	);
}
