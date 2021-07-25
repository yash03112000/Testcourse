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
import TestCard from '../components/dashboard/TestCard';
import CourseCard from '../components/dashboard/CourseCard';
import DigitalCard from '../components/dashboard/DigitalCard';

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
	btnbox: {
		display: 'flex',
		flexDirection: 'column',
		marginTop: 20,
		marginBottom: 10,
	},
	main: {
		display: 'flex',
		flexDirection: 'column',
		// justifyContent: 'center',
		// alignItems: 'center',
		width: '100vw',
	},
}));

export default function Home() {
	const [load, setLoad] = useState(true);
	const [data, setData] = useState({});
	const router = useRouter();
	const classes = useStyles();

	useEffect(() => {
		initial();
	}, []);

	const initial = () => {
		fetch(`/DashboardServer/teacher`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					// console.log(res);
					setData(res);
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
				<script src="https://checkout.razorpay.com/v1/checkout.js" />
			</Head>

			<main className={classes.main}>
				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<h1>Courses Published</h1>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							overflow: 'scroll',
						}}
					>
						{data.courses.map((course, i) => {
							return (
								<div key={i} style={{ margin: 20 }}>
									<CourseCard data={course} />
								</div>
							);
						})}
					</div>
				</div>
				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<h1>Test Published</h1>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							overflow: 'scroll',
						}}
					>
						{data.tests.map((test, i) => {
							return (
								<div key={i} style={{ margin: 20 }}>
									<TestCard data={test} />
								</div>
							);
						})}
					</div>
				</div>
				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<h1>Digital Product Published</h1>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							overflow: 'scroll',
						}}
					>
						{data.digitals.map((course, i) => {
							return (
								<div key={i} style={{ margin: 20 }}>
									<DigitalCard data={course} />
								</div>
							);
						})}
					</div>
				</div>

				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<h1>Options</h1>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							justifyContent: 'space-around',
							// overflow: 'scroll',
						}}
					>
						<div style={{ cursor: 'pointer' }}>
							<Link href="/add_test">
								<div>
									<Typography>Add Test</Typography>
								</div>
							</Link>
						</div>

						<div style={{ cursor: 'pointer' }}>
							<Link href="/add_course">
								<div>
									<Typography>Add Course</Typography>
								</div>
							</Link>
						</div>
						<div style={{ cursor: 'pointer' }}>
							<Link href="/add_digital">
								<div>
									<Typography>Add Digital Product</Typography>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
