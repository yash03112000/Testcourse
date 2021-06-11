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
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
	main: {
		display: 'flex',
		flexDirection: 'column',
		width: '90%',
		// backgroundColor: 'purple',
		margin: 10,
		padding: 10,
		border: '0.2px solid rgba(0,0,0,0.2)',
		borderRadius: 5,
	},
	head: {
		color: 'black',
		fontSize: 20,
		fontWeight: 'bold',
		padding: 5,
	},
	top: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text: {
		color: 'black',
		padding: 10,
	},
}));

export default function Home({ data }) {
	// const router = useRouter();
	const classes = useStyles();

	return (
		<div className={classes.main}>
			<div className={classes.top}>
				<div>
					<Typography
						component="h1"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.head}
					>
						Requirement
					</Typography>
				</div>
			</div>
			<div className={classes.bottom}>
				<ul>
					{data.map((dat, i) => (
						<li key={i}>{dat}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
