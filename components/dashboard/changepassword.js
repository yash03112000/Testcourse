import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css';
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
import TestCard from './TestCard';
import CourseCard from './CourseCard';
import DigitalCard from './/DigitalCard';
import axios from 'axios';

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

export default function Home({ data }) {
	// const [load, setLoad] = useState(true);
	// const [data, setData] = useState({});
	const router = useRouter();
	const classes = useStyles();
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [msg, setMsg] = useState('');

	const change = async () => {
		try {
			if (oldPassword === '' || newPassword === '')
				setMsg('Plz fill All The fields');
			else {
				setMsg('');
				try {
					const res = await axios.post(`/auth/change`, {
						oldPassword,
						newPassword,
					});
					if (res.data.status == 403) {
						setMsg('Wrong Password');
					} else {
						setMsg('Password Changed');
					}
				} catch (e) {
					// console.log(e.response);
					if (e.response.status === 403) {
						router.replace('/LogIn');
						setMsg(e.message);
					}
				}
			}
		} catch (e) {
			setMsg(e.message);
		}
	};

	return (
		<div className={classes.container}>
			<main className={classes.main}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<h1>Change Password</h1>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						color: 'red',
					}}
				>
					{msg}
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<TextField
						type="password"
						label="Old Password"
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<TextField
						type="password"
						label="New Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Button onClick={change}>Submit</Button>
				</div>
			</main>
		</div>
	);
}
