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
		justifyContent: 'center',
	},
}));

export default function Home({ data }) {
	const router = useRouter();
	const classes = useStyles();
	const [courses, setCourses] = useState(data.courses);

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
							Top Courses
						</Typography>
					</div>
					<div className={classes.carddiv}>
						{courses.map((course, i) => {
							return <CourseCard key={i} data={course} />;
						})}
					</div>
				</div>
				{/* <div className={classes.heading}>
					<div>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.header}
						>
							Top 10 Courses
						</Typography>
					</div>
					<div className={classes.carddiv}>
						<CourseCard />
					</div>
				</div> */}
				<Footer />
			</main>
		</div>
	);
}

export async function getStaticProps() {
	// console.log(server)
	var res = await fetch(`${server}/CourseServer/`);
	var data = await res.json();

	// var a = data.courses;

	return {
		props: { data }, // will be passed to the page component as props
	};
}
