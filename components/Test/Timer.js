import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import ReactDOM, { unstable_batchedUpdates as unstable } from 'react-dom';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
	Select,
	MenuItem,
	InputLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
	Modal,
	Backdrop,
	Fade,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({}));

export default function Home({ timeleft, timeover }) {
	const [time, setTime] = useState(timeleft);
	const [oldtime, setoldTime] = useState(timeleft);

	const router = useRouter();
	const classes = useStyles();

	const { id: testid } = router.query;

	// console.log(timeleft);

	useEffect(() => {
		if (timeleft != oldtime) {
			setTime(timeleft);
			setoldTime(timeleft);
			if (timeleft <= 0) {
				console.log('bleh');
				setTime(0);
			}
		} else {
			if (time <= 0) {
				console.log('bleh');
				setTime(0);
				timeover();
				return;
			}
		}

		const x = setInterval(() => {
			setTime((time) => time - 1);
		}, 1000);

		return () => {
			clearInterval(x);
		};
	}, [time, timeleft]);

	return (
		<div>
			<div>
				<Typography
					component="span"
					color="primary"
					variant="subtitle1"
					gutterBottom
					style={{ color: 'black', margin: 5 }}
				>
					Time Left:{time}
				</Typography>
			</div>
		</div>
	);
}
