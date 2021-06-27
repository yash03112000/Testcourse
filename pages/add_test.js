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
	InputLabel,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from '../components/Header';
import StepCom from '../components/AddTest/StepCom';
import BasicInfo from '../components/AddTest/BasicInfo';

const useStyles = makeStyles((theme) => ({
	main: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
	},
	head: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		margin: 20,
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
	},
}));

export default function Home() {
	const [load, setLoad] = useState(false);
	const [step, setStep] = useState();
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();

	useEffect(() => {
		// initial();
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
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const changestep = (id) => {
		setStep(id);
	};

	const stepfun = () => {
		if (step === 1) return <BasicInfo {...{ changestep }} />;
	};

	return load ? (
		<div>
			<h1>Loading...</h1>
		</div>
	) : (
		<div className={classes.container}>
			<Head>
				<title>TestCourse</title>
			</Head>

			<main className={classes.main}>
				<Header />
				<div className={classes.head}>
					<Typography className={classes.heading}>Create A New Exam</Typography>
				</div>
				<StepCom {...{ step }} />
				{stepfun()}
			</main>
		</div>
	);
}
