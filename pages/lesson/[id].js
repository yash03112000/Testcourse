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
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from '../../components/Header';
import Content from '../../components/Lesson/Content';

const useStyles = makeStyles((theme) => ({
	main: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
	},
}));

export default function Home() {
	const [load, setLoad] = useState(false);
	const [tests, setTests] = useState([]);
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
		<div className={classes.container}>
			<Head>
				<title>TestCourse</title>
				<script src="https://player.vimeo.com/api/player.js"></script>
			</Head>

			<main className={classes.main}>
				<Header />
				<Content />
			</main>
		</div>
	);
}
