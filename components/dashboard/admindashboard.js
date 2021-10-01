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
	Select,
	MenuItem,
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
import ChangePassword from './changepassword';
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
	const [usersearch, setUsersearch] = useState('');
	const [msg, setMsg] = useState('');
	const [user, setUser] = useState({});
	const router = useRouter();
	const classes = useStyles();

	const search = async () => {
		try {
			if (usersearch === '') setMsg('Plz fill All The fields');
			else {
				setMsg('');
				try {
					const res = await axios.post(
						`/DashboardServer/admin/role`,
						{
							usersearch,
						},
						{
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': localStorage.getItem('token'),
							},
						}
					);
					// console.log('hehe');
					console.log(res);
					if (res.data.status == 403) {
						setMsg(res.data.msg);
					} else if (res.data.status == 404) {
						setMsg(res.data.msg);
					} else {
						setMsg('');
						setUser(res.data.user);
					}
				} catch (e) {
					console.log(e.message);
					if (e.response.status === 403) {
						router.replace('/LogIn');
						setMsg(e.message);
					}
				}
			}
		} catch (e) {
			console.log(e);
			setMsg(e.message);
		}
	};

	const change = async () => {
		try {
			setMsg('');
			try {
				const res = await axios.post(
					`/DashboardServer/admin/rolechange`,
					{
						user,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': localStorage.getItem('token'),
						},
					}
				);
				if (res.data.status == 403) {
					setMsg(res.data.msg);
				} else if (res.data.status == 404) {
					setMsg(res.data.msg);
				} else {
					setMsg('Changed');
					setUser({});
					setUsersearch('');
				}
			} catch (e) {
				console.log(e.message);
				if (e.response.status === 403) {
					router.replace('/LogIn');
					setMsg(e.message);
				}
			}
		} catch (e) {
			console.log(e);
			setMsg(e.message);
		}
	};

	return (
		<div className={classes.container}>
			<main className={classes.main}>
				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<h1>Test Bought</h1>
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
									<TestCard {...{ test, router }} type={data.type} />
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
						<h1>Courses Bought</h1>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							overflow: 'scroll',
						}}
					>
						{data.courses.map((test, i) => {
							return (
								<div key={i} style={{ margin: 20 }}>
									<TestCard {...{ test, router }} type={data.type} />
								</div>
							);
						})}
					</div>
				</div>
				<ChangePassword />
				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<h1>Admin Roles</h1>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
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
							type="username"
							label="Type Unique ID"
							value={usersearch}
							onChange={(e) => setUsersearch(e.target.value)}
						/>
					</div>
					{typeof user.username !== 'undefined' ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-around',
								padding: 20,
							}}
						>
							<div>{user.username}</div>
							<div>
								<Select
									labelId="demo-simple-select-helper-label"
									id="demo-simple-select-helper"
									onChange={(e) => {
										setUser((prevState) => ({
											...prevState,
											type: e.target.value,
										}));
									}}
									value={user.type}
									// style={{ width: 100 }}
								>
									<MenuItem value={'User'}>User</MenuItem>
									<MenuItem value={'Teacher'}>Teacher</MenuItem>
									<MenuItem value={'Admin'}>Admin</MenuItem>
								</Select>
							</div>
							<div>
								<Button onClick={change}>Change</Button>
							</div>
						</div>
					) : (
						<></>
					)}

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<Button onClick={search}>Submit</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
