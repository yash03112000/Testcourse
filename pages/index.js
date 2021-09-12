import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
	Badge,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from '../components/Header';
import Banner from '../components/Home/Banner';
import CourseCard from '../components/Home/CourseCard';
import TestCard from '../components/Home/TestCard';
import DigitalCard from '../components/Home/DigitalCard';

import Footer from '../components/Footer';
import { server } from '../config';

const useStyles = makeStyles((theme) => ({
	heading: {
		display: 'flex',
		flexDirection: 'column',
	},
	header: {
		padding: 40,
		fontSize: 25,
		color: 'black',
		opacity: 0.6,
	},
	carddiv: {
		display: 'flex',
		flexDirection: 'row',
		// justifyContent: 'center',
		// maxWidth: '100vw',
		overflow: 'scroll',
		marginBottom: 20,
		// scrollMargin: 20,
	},
}));

export default function Home({ data }) {
	const router = useRouter();
	const classes = useStyles();
	const [courses, setCourses] = useState(data.courses);
	// console.log(router);

	return (
		<div className={classes.container}>
			<Head>
				<title>HomePage</title>
			</Head>

			<main className={classes.main}>
				<Header />
				<Banner />
				<div className={classes.heading}>
					<div>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.header}
						>
							Courses
						</Typography>
					</div>
					<div className={classes.carddiv}>
						{courses.map((course, i) => {
							return <CourseCard key={i} data={course} />;
						})}
					</div>
				</div>
				<div className={classes.heading}>
					<div>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.header}
						>
							Tests
						</Typography>
					</div>
					<div className={classes.carddiv}>
						{data.tests.map((course, i) => {
							return <TestCard key={i} data={course} />;
						})}
					</div>
				</div>
				<div className={classes.heading}>
					<div>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.header}
						>
							Digital Products
						</Typography>
					</div>
					<div className={classes.carddiv}>
						{data.digitals.map((course, i) => {
							return <DigitalCard key={i} data={course} />;
						})}
					</div>
				</div>
				<Footer />
			</main>
		</div>
	);
}

export async function getServerSideProps() {
	// console.log(server)
	try {
		var res = await fetch(`${server}/CourseServer/`);
		// console.log(res);
		var data = await res.json();

		// var a = data.courses;

		return {
			props: { data }, // will be passed to the page component as props
		};
	} catch (e) {
		console.log('Fetch Request is not returning JSON File');
	}
}
