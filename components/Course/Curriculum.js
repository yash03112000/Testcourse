// import Head from 'next/head';
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
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';

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
	topright: {
		display: 'flex',
		flexDirection: 'row',
	},
	text: {
		color: 'black',
		padding: 10,
	},
	accordhead: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// backgroundColor: 'red',
		width: '100%',
	},
	detail: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		// backgroundColor: 'red',
		// border: '1px solid black',
		padding: 10,
	},
}));

export default function Home({ data }) {
	// const router = useRouter();
	const classes = useStyles();

	const lessonfun = () => {
		var sum = 0;
		data.map((sec, i) => {
			sum += sec.lessons.length;
		});
		return sum;
	};

	const cirdate = () => {
		var sum = 0;
		data.map((sec, i) => {
			sec.lessons.map((tim, i) => {
				sum += tim.secs;
			});
		});
		return moment('1900-01-01 00:00:00').add(sum, 'seconds').format('HH:mm:ss');
	};
	const sectime = (sec) => {
		var sum = 0;
		sec.lessons.map((les, i) => {
			sum += les.secs;
		});
		return moment('1900-01-01 00:00:00').add(sum, 'seconds').format('HH:mm:ss');
	};

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
						Curriculum
					</Typography>
				</div>
				<div className={classes.topright}>
					<div>
						<Typography
							component="h1"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.text}
						>
							{lessonfun()} Lessons
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
							{cirdate()}
						</Typography>
					</div>
				</div>
			</div>
			<div className={classes.bottom}>
				{data.map((dat, i) => (
					<Accordion key={i}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<div className={classes.accordhead}>
								<div>
									<Typography className={classes.heading}>
										{dat.title}
									</Typography>
								</div>
								<div>
									<Typography className={classes.heading}>
										{sectime(dat)}
									</Typography>
								</div>
							</div>
						</AccordionSummary>
						{dat.lessons.map((les, index) => (
							<AccordionDetails key={index}>
								<div className={classes.detail}>
									{/* <div className={classes.row}> */}
									<Link href={`/lesson/${les._id}`}>
										<div style={{ cursor: 'pointer' }}>{les.title}</div>
									</Link>
									<div>
										{moment('1900-01-01 00:00:00')
											.add(les.secs, 'seconds')
											.format('HH:mm:ss')}
									</div>
								</div>
							</AccordionDetails>
						))}
					</Accordion>
				))}
			</div>
		</div>
	);
}
