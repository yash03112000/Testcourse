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
import UserDashboard from '../components/dashboard/userdashboard';
import TeacherDashboard from '../components/dashboard/teacherdashboard';
import AdminDashboard from '../components/dashboard/admindashboard';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
	// const [type, setType] = useState('');
	const [data, setData] = useState({});
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
					// console.log(res);
					setData(res);
					setLoad(false);
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const type = () => {
		if (data.type == 'User') return <UserDashboard data={data} />;
		else if (data.type == 'Teacher') return <TeacherDashboard data={data} />;
		else if (data.type == 'Admin') return <AdminDashboard data={data} />;
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
			<Header />
			{type()}
			<Footer />
		</div>
	);
}
