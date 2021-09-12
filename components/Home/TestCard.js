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
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
	head: {
		height: 180,
		width: 300,
		// backgroundColor: 'red',
		margin: 20,
		boxShadow: '10px 10px 30px silver',
		'&:hover': {
			// transcale: 3,
			// backgroundColor: 'red',
			// height: 500,
			transform: 'scaleY(1.1) scaleX(1.2)',
		},
		display: 'flex',
		flexDirection: 'row',
	},
	imgdiv: {
		// height: 150,
		cursor: 'pointer',
		width: '50%',
	},
	img: {
		height: '100%',
		width: '100%',
		objectFit: 'co',
	},
	title: {
		fontSize: 15,
		color: 'black',
		fontWeight: 'bolder',
		padding: 5,
	},
	subtitle: {
		fontSize: 12,
		color: 'black',
		fontWeight: 'lighter',
		padding: 5,
	},
	condiv: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		// backgroundColor: 'blue',
		height: 150,
		padding: 10,
	},
	pricediv: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	price: {
		fontSize: 15,
		color: 'black',
		fontWeight: 'lighter',
		padding: 5,
	},
}));

export default function Home({ data }) {
	// const router = useRouter();
	const classes = useStyles();
	const router = useRouter();

	return (
		<div>
			<div className={classes.head}>
				<div
					className={classes.imgdiv}
					onClick={() => router.push(`/testinstructions/${data._id}`)}
				>
					{data.thumbnail == '' ? (
						<img src="/static/banner.jpg" className={classes.img} />
					) : (
						<img
							src={`/static/${data.thumbnail}.jpg`}
							className={classes.img}
						/>
					)}
				</div>
				<div className={classes.condiv}>
					<div>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.title}
						>
							{data.title}
						</Typography>
					</div>
					<div>
						<Typography
							component="p"
							color="primary"
							variant="subtitle1"
							gutterBottom
							className={classes.subtitle}
						>
							{parse(data.short_description)}
						</Typography>
					</div>
					<div className={classes.pricediv}>
						{data.is_free ? (
							<Typography
								component="p"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.price}
							>
								<span
									style={{
										fontWeight: 'bolder',
									}}
								>
									FREE
								</span>
							</Typography>
						) : (
							<>
								{!data.is_on_sale ? (
									<Typography
										component="p"
										color="primary"
										variant="subtitle1"
										gutterBottom
										className={classes.price}
									>
										<span>&#8377;</span>
										<span
											style={{
												fontWeight: 'bolder',
											}}
										>
											{data.price}
										</span>
									</Typography>
								) : (
									<Typography
										component="p"
										color="primary"
										variant="subtitle1"
										gutterBottom
										className={classes.price}
									>
										<span>&#8377;</span>
										<span
											style={{
												textDecoration: 'line-through',
												color: 'grey',
												margin: 6,
											}}
										>
											{data.price}
										</span>
										<span
											style={{
												fontWeight: 'bolder',
											}}
										>
											{data.sale_price}
										</span>
									</Typography>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
