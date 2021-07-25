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
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PersonIcon from '@material-ui/icons/Person';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
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
	bottom: {
		display: 'flex',
		flexDirection: 'row',
	},
	left: {
		display: 'flex',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '60',
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
}));

export default function Home() {
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
						About The Instructor
					</Typography>
				</div>
			</div>
			<div className={classes.bottom}>
				<div className={classes.left}>
					<div className={classes.logodiv}>
						<img src="/static/malefig.jpg" className={classes.logo} />
					</div>
					<div className={classes.row}>
						<ChatBubbleOutlineIcon />
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							0 reviews
						</Typography>
					</div>
					<div className={classes.row}>
						<PersonIcon />
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							4 Students
						</Typography>
					</div>
					<div className={classes.row}>
						<PlayCircleFilledIcon />
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							1 Courses
						</Typography>
					</div>
				</div>

				<div className={classes.right}>
					<div>
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							Vipin Kumar
						</Typography>
					</div>
					<div>
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							Rest
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
}
