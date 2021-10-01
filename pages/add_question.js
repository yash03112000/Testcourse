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
import AddQuestion from '../components/AddTest/AddQuestion';
import Header from '../components/Header';

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
	const [load, setLoad] = useState(true);
	const [isNew, setIsNew] = useState(true);
	const [step, setStep] = useState(0);
	const router = useRouter();
	const { id, edit } = router.query;
	// console.log(router);
	const classes = useStyles();

	useEffect(() => {
		if (edit) initial();
		else setLoad(false);
	}, [edit]);

	const initial = () => {
		console.log(edit);
		setLoad(true);
		setIsNew(false);

		fetch(`/AddTestServer/${edit}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status == 200) {
						setStep(res.id);
						setLoad(false);
					}
				});
			} else if (res.status == 403) {
				router.push(`/LogIn?next=${router.asPath}`);
				// router.replace('/LogIn');
			}
		});
	};

	const changestep = (a, id) => {
		router.replace(`/add_test?edit=${id}`);
		// setStep(id);
	};

	const stepfun = () => {
		if (step === 0) return <AddQuestion isTest={false} />;
		// if (step === 1) return <SectionInfo {...{ changestep, isNew, edit }} />;
		// if (step === 2) return <AddQuestion {...{ changestep, isNew, edit }} />;
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
				{/* <StepCom {...{ step }} /> */}
				{stepfun()}
			</main>
		</div>
	);
}
