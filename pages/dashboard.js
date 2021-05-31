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
import { GetStaticProps } from 'next';
import FacebookIcon from '@material-ui/icons/Facebook';
import TestCard from '../components/TestCard';

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
	main: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

export default function Home() {
	const [load, setLoad] = useState(true);
	const [tests, setTests] = useState([]);
	const router = useRouter();
	const classes = useStyles();

	useEffect(() => {
		initial();
	}, []);

	const initial = () => {
		fetch(`/DashboardServer`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					setTests(res.tests);
					setLoad(false);
				});
			}
		});
	};

	return load ? (
		<div>
			<h1>Loading...</h1>
		</div>
	) : (
		<div className={classes.container}>
			<Head>
				<title>TestCourse</title>
				<script src="https://checkout.razorpay.com/v1/checkout.js" />
			</Head>

			<main className={classes.main}>
				<h1>Dashboard</h1>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{tests.map((test, i) => {
						return (
							<div key={i} style={{ margin: 20 }}>
								<TestCard {...{ test, router }} />
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
}
