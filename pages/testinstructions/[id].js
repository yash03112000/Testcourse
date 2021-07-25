import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css';
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
import Header from '../../components/Header';
import Banner from '../../components/TestInstructions/Banner';
import Left from '../../components/TestInstructions/Left';
import Right from '../../components/TestInstructions/Right';
import Footer from '../../components/Footer';
import { server } from '../../config';

const useStyles = makeStyles((theme) => ({
	maincon: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'row',
		// backgroundColor: 'pink',
		// height: '30vh',
		[theme.breakpoints.down('sm')]: {
			// flexDirection: 'column',
			// height: '15vh',
			flexDirection: 'column-reverse',
		},
	},
}));

export default function Home({ data }) {
	const router = useRouter();
	const classes = useStyles();

	// console.log(data);

	return (
		<div className={classes.container}>
			<Head>
				<title>HomePage</title>
				<script src="https://checkout.razorpay.com/v1/checkout.js" />
			</Head>

			<main className={classes.main}>
				<Header />
				<Banner data={data.routes} />
				<div className={classes.maincon}>
					<Left data={data.routes} />
					<Right data={data.routes} />
					{/* <div style={{ flex: 1, backgroundColor: 'blue' }}></div> */}
				</div>
				<Footer />
			</main>
		</div>
	);
}

export async function getStaticPaths() {
	// console.log(server)
	var res = await fetch(`${server}/CourseServer/`);
	var data = await res.json();

	// var a = data.courses;
	// console.log(a);
	const paths = data.tests.map((route) => ({
		params: { id: route._id },
	}));

	return {
		paths,
		fallback: false, // will be passed to the page component as props
	};
}

export async function getStaticProps(ctx) {
	// console.log(server)
	var res = await fetch(`${server}/CourseServer/testdetails/${ctx.params.id}`);
	if (res.status == 404) {
		return {
			redirect: {
				destination: '/404',
				permanent: false,
			},
		};
	} else if (res.status == 403) console.log('403');
	var data = await res.json();

	// var a = data.courses;

	return {
		props: { data }, // will be passed to the page component as props
	};
}
