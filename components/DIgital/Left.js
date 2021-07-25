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
import Learn from './Learn';
import Curriculum from './Curriculum';
import Requirement from './Requirement';
import Instructor from './Instructor';
import Feedback from './Feedback';
const useStyles = makeStyles((theme) => ({
	head: {
		flex: 2,
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 20,
	},
}));

export default function Home({ data }) {
	// const router = useRouter();
	const classes = useStyles();

	return (
		<div className={classes.head}>
			{/* <Learn data={data.outcomes} /> */}
			{/* <Curriculum data={data.sections} /> */}
			{/* <Requirement data={data.requirements} /> */}
			<Instructor />
			{/* <Feedback
				total={data.total_ratings}
				avg={data.rating}
				rating={data.ratings_count}
			/> */}
		</div>
	);
}
