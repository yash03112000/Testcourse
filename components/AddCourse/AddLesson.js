import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useMemo } from 'react';
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
	Checkbox,
	Modal,
	Switch,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Editor from '../editor';
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
	main: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		// backgroundColor: 'red',
		justifyContent: 'center',
		// height: '40vh',
	},
	head: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		margin: 20,
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 20,
		alignItems: 'center',
	},
}));

export default function Home({ secid, edit, changestates }) {
	const [load, setLoad] = useState(false);
	const [title, setTitle] = useState('');
	const [url, setURL] = useState('');
	const [HDurl, setHDURL] = useState('');
	const [SDurl, setSDURL] = useState('');
	const [Medurl, setMedURL] = useState('');
	const [sec, setSec] = useState('');
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();

	const hasAns = () => {
		var bool = false;
		options.forEach((option) => {
			if (option.correct) bool = true;
		});
		return bool;
	};

	const uploadLess = () => {
		var a = {};
		if (
			title !== '' &&
			secid !== '' &&
			url !== '' &&
			sec !== '' &&
			edit !== ''
		) {
			fetch(`/AddCourseServer/addLesson`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-access-token': localStorage.getItem('token'),
				},
				body: JSON.stringify({
					id: edit,
					secid,
					title,
					url,
					sec,
					HDurl,
					SDurl,
					Medurl,
				}),
			}).then((res) => {
				if (res.status === 200) {
					res.json().then((res) => {
						if (res.status === 200) {
							changestates('data', res.sections);
							changestates('dis', 'none');
							changestates('secid', '');
							setTitle('');
							setURL('');
							setHDURL('');
							setSDURL('');
							setMedURL('');
							setSec('');
						}
					});
				} else if (res.status == 403) {
					router.push(`/LogIn?next=${router.asPath}`);

					// router.replace('/LogIn');
				}
			});
		}
	};

	return load ? (
		<div>
			<h1>Loading...</h1>
		</div>
	) : (
		<div className={classes.main}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					// margin: 40,
					// backgroundColor: 'red',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Typography style={{ fontSize: 25, margin: 20, fontWeight: 'bold' }}>
						Add Lesson
					</Typography>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Title:
					</Typography>
					<TextField
						type="username"
						required
						label="Lesson Title"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Vimeo ID:
					</Typography>
					<TextField
						type="username"
						required
						label="Vimeo ID"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={url}
						onChange={(e) => setURL(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Player Link For App(HD)
					</Typography>
					<TextField
						type="username"
						required
						label="Player Link For App(HD)"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={HDurl}
						onChange={(e) => setHDURL(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Player Link For App(Med)
					</Typography>
					<TextField
						type="username"
						required
						label="Player Link For App(Med)"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={Medurl}
						onChange={(e) => setMedURL(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Player Link For App(SD)
					</Typography>
					<TextField
						type="username"
						required
						label="Player Link For App(SD)"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={SDurl}
						onChange={(e) => setSDURL(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Durations(secs)
					</Typography>
					<TextField
						type="number"
						required
						label="Duration"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={sec}
						onChange={(e) => setSec(e.target.value)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						marginTop: 10,
					}}
				>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{ marginTop: 10 }}
						className={classes.submit}
						onClick={uploadLess}
					>
						Upload Lesson
					</Button>
				</div>
			</div>
		</div>
	);
}
