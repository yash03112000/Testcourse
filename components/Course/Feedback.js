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
	LinearProgress,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import StarRating from 'react-svg-star-rating';

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
	head2: {
		color: 'black',
		fontSize: 30,
		fontWeight: 'bold',
		// padding: 5,
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
	bottom: {
		display: 'flex',
		flexDirection: 'row',
	},
	left: {
		display: 'flex',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '40%',
	},
	logo: {
		width: '100%',
		borderRadius: 200,
	},
	course: {
		color: 'black',
	},
	logodiv: {
		// flex: 1,
		// backgroundColor: 'red',
		margin: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '60%',
		alignItems: 'center',
	},
	logo: {
		width: '100%',
		borderRadius: 200,
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		// backgroundColor: 'red',
		alignItems: 'center',
	},
	right: {
		width: '100%',
	},
	progdiv: {
		// backgroundColor: 'red',
		width: '70%',
	},
	progress: {
		height: 20,
		borderRadius: 10,
		width: '100%',
	},
}));

export default function Home({ total, avg, rating }) {
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
						Student Feedback
					</Typography>
				</div>
			</div>
			<div className={classes.bottom}>
				<div className={classes.left}>
					<div className={classes.logodiv}>
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.head2}
						>
							{avg}
						</Typography>
					</div>
					<div className={classes.logodiv}>
						<StarRating size="20" initialRating={avg} />
					</div>
					<div className={classes.logodiv}>
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							Average Rating
						</Typography>
					</div>
				</div>

				<div className={classes.right}>
					<div className={classes.row}>
						<div className={classes.progdiv}>
							<LinearProgress
								variant="determinate"
								value={(rating.rated_1 / total) * 100}
								className={classes.progress}
							/>
						</div>
						<div>
							<Typography
								component="h1"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.text}
							>
								1
							</Typography>
						</div>
					</div>
					<div className={classes.row}>
						<div className={classes.progdiv}>
							<LinearProgress
								variant="determinate"
								value={(rating.rated_2 / total) * 100}
								className={classes.progress}
							/>
						</div>
						<div>
							<Typography
								component="h1"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.text}
							>
								2
							</Typography>
						</div>
					</div>
					<div className={classes.row}>
						<div className={classes.progdiv}>
							<LinearProgress
								variant="determinate"
								value={(rating.rated_3 / total) * 100}
								className={classes.progress}
							/>
						</div>
						<div>
							<Typography
								component="h1"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.text}
							>
								3
							</Typography>
						</div>
					</div>
					<div className={classes.row}>
						<div className={classes.progdiv}>
							<LinearProgress
								variant="determinate"
								value={(rating.rated_4 / total) * 100}
								className={classes.progress}
							/>
						</div>
						<div>
							<Typography
								component="h1"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.text}
							>
								4
							</Typography>
						</div>
					</div>
					<div className={classes.row}>
						<div className={classes.progdiv}>
							<LinearProgress
								variant="determinate"
								value={(rating.rated_5 / total) * 100}
								className={classes.progress}
							/>
						</div>
						<div>
							<Typography
								component="h1"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.text}
							>
								5
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
