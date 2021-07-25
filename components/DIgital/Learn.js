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
const useStyles = makeStyles((theme) => ({
	learn1: {
		display: 'flex',
		flexDirection: 'column',
		width: '90%',
		// backgroundColor: 'purple',
		margin: 10,
		padding: 10,
		border: '0.2px solid rgba(0,0,0,0.2)',
		borderRadius: 5,
	},
	learnbottom: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 5,
	},
	learnhead: {
		color: 'black',
		fontSize: 20,
		fontWeight: 'bold',
		padding: 5,
	},
	outcome: {
		color: 'black',
	},
}));

export default function Home({ data }) {
	// const router = useRouter();
	const classes = useStyles();

	return (
		<div className={classes.learn1}>
			<div className={classes.learntop}>
				<div>
					<Typography
						component="h1"
						color="primary"
						variant="subtitle1"
						gutterBottom
						className={classes.learnhead}
					>
						What Will You Learn?
					</Typography>
				</div>
			</div>
			<div className={classes.learnbottom}>
				{data.map((dat, i) => (
					<div key={i}>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.outcome}
						>
							{dat}
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
}
