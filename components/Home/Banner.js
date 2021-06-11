// import Head from 'next/head';
// import Link from 'next/link';
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
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
const useStyles = makeStyles((theme) => ({
	head: {
		backgroundImage: 'url(/static/banner.jpg)',
		height: '80vh',
		width: '100vw',
		backgroundSize: '100% 100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	header: {
		fontSize: 50,
		color: 'white',
	},
	subtitle: {
		fontSize: 20,
		color: 'white',
		width: '50%',
	},
}));

export default function Home() {
	// const router = useRouter();
	const classes = useStyles();

	return (
		<div>
			<div className={classes.head}>
				<div>
					<Typography
						component="h4"
						color="primary"
						variant="h3"
						className={classes.header}
						gutterBottom
					>
						Learn on your schedule
					</Typography>
				</div>
				<div>
					<Typography
						component="h4"
						color="primary"
						variant="subtitle1"
						className={classes.subtitle}
						gutterBottom
					>
						Study any topic, anytime. Explore thousands of courses for the
						lowest price ever!
					</Typography>
				</div>
			</div>
		</div>
	);
}
