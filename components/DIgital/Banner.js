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
	Chip,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import StarRating from 'react-svg-star-rating';
import moment from 'moment';
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
	head: {
		// backgroundImage: 'url(/static/banner.jpg)',
		height: '40vh',
		width: '100vw',
		backgroundSize: '100% 100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: 'hsl(360,0%,15%)',
		paddingLeft: 30,
	},
	header: {
		fontSize: 40,
		color: 'white',
	},
	subtitle: {
		fontSize: 18,
		color: 'white',
		width: '50%',
	},
	stardiv: {
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	subtitle2: {
		fontSize: 15,
		color: 'white',
		margin: 10,
		// width: '50%',
	},
}));

export default function Home({ data }) {
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
						{data.title}
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
						{parse(data.short_description)}
					</Typography>
				</div>
				<div className={classes.stardiv}>
					{data.tags.map((tag, i) => (
						<Chip
							color="primary"
							size="medium"
							label={tag}
							style={{ marginRight: 5 }}
							key={i}
						/>
					))}

					<div style={{ paddingLeft: 10 }}>
						<StarRating
							size="20"
							initialRating={data.rating}
							count={5}
							unit="float"
						/>
					</div>
					<div>
						<Typography
							component="h4"
							color="primary"
							variant="subtitle1"
							className={classes.subtitle2}
							gutterBottom
						>
							{data.rating}
						</Typography>
					</div>
					<div>
						<Typography
							component="h4"
							color="primary"
							variant="subtitle1"
							className={classes.subtitle2}
							gutterBottom
						>
							{data.total_ratings} Ratings
						</Typography>
					</div>
					<div>
						<Typography
							component="h4"
							color="primary"
							variant="subtitle1"
							className={classes.subtitle2}
							gutterBottom
						>
							N students enrolled
						</Typography>
					</div>
				</div>
				<div className={classes.stardiv}>
					<div>
						<Typography
							component="h4"
							color="primary"
							variant="subtitle1"
							className={classes.subtitle2}
							gutterBottom
						>
							Created By ABCD
						</Typography>
					</div>
					<div>
						<Typography
							component="h4"
							color="primary"
							variant="subtitle1"
							className={classes.subtitle2}
							gutterBottom
						>
							Last Updated :
							{moment(data.last_updated).format('MMMM Do YYYY,h:mm a')}
						</Typography>
					</div>
					<div>
						{data.languages.map((lang, i) => (
							<Typography
								component="h4"
								color="primary"
								variant="subtitle1"
								className={classes.subtitle2}
								gutterBottom
								key={i}
							>
								{lang}
							</Typography>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
