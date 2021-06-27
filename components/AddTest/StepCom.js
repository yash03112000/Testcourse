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
	Stepper,
	Step,
	StepLabel,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	main: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
		// backgroundColor: 'red',
		// height: '40vh',
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

export default function Home({ step }) {
	const [load, setLoad] = useState(false);
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

	return load ? (
		<div>
			<h1>Loading...</h1>
		</div>
	) : (
		<div className={classes.main}>
			<Stepper activeStep={step} alternativeLabel>
				<Step>
					<StepLabel>Basic Info</StepLabel>
				</Step>
				<Step>
					<StepLabel>Sections</StepLabel>
				</Step>
				<Step>
					<StepLabel>Questions</StepLabel>
				</Step>
			</Stepper>
		</div>
	);
}
