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
						<h1>Courses Bought</h1>
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
									<CourseCard data={course} type={data.type} />
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
									<TestCard data={test} type={data.type} />
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
						<h1>Digital Products Bought</h1>
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
									<DigitalCard data={course} type={data.type} />
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</div>
	);
}
