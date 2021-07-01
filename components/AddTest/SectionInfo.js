import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import ReactDOM, { unstable_batchedUpdates as unstable } from 'react-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddQuestion from './AddQuestion';
const useStyles = makeStyles((theme) => ({
	main: {
		width: '100vw',
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
}));

export default function Home({ changestep, isNew, edit }) {
	const [load, setLoad] = useState(false);
	const [dis, setDis] = useState('none');
	const [Name, setName] = useState('');
	const [secid, setSecid] = useState('');
	const [data, setData] = useState([]);
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();

	useEffect(() => {
		if (!isNew) initial();
	}, []);

	const initial = () => {
		fetch(`/AddTestServer/step1/${edit}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status === 200) {
						setData(res.sections);
						setLoad(false);
					}
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const changestates = (state, value) => {
		if (state === 'data') setData(value);
		else if (state === 'dis') setDis(value);
		else if (state === 'secid') setSecid(value);
		// else if (state === 'secid') setSecid(value);
	};

	const submit = () => {
		console.log('aa');
		fetch(`/AddTestServer/step1`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: edit, name: Name }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status === 200) {
						// setPrice(res.test.price);
						// setFree(res.test.free);
						// setSalePrice(res.test.sale_price);
						// setSale(res.test.is_on_sale);
						// setTitle(res.test.title);
						// changestep(2);
						setData(res.sections);
						setLoad(false);
					}
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const next = () => {
		// setMsg(false);
		// changestep(2);
		router.replace('/dashboard');
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
					width: '60%',
					margin: 40,
					// backgroundColor: 'red',
				}}
			>
				<div style={{ width: '100%' }}>
					<TextField
						type="username"
						required
						label="Section"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={Name}
						style={{ width: '100%' }}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{ margin: 5 }}
						className={classes.submit}
						onClick={submit}
					>
						Add Section
					</Button>
				</div>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Typography style={{ fontSize: 25, margin: 20, fontWeight: 'bold' }}>
						Sections
					</Typography>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{data.map((dat, i) => (
						<Accordion key={i}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<div className={classes.accordhead}>
									<div>
										<Typography style={{ fontSize: 15 }}>
											{dat.title}
										</Typography>
									</div>
									<div>
										<Typography style={{ fontSize: 15 }}>
											{dat.questions.length}
										</Typography>
									</div>
								</div>
							</AccordionSummary>
							<AccordionDetails>
								<div
									style={{ color: 'grey', opacity: 0.5, cursor: 'pointer' }}
									onClick={() => {
										setDis('block');
										setSecid(dat._id);
									}}
								>
									Add Question...
								</div>
							</AccordionDetails>
							{dat.questions.map((les, index) => (
								<AccordionDetails key={index}>
									<div className={classes.detail}>{les._id}</div>
								</AccordionDetails>
							))}
						</Accordion>
					))}
				</div>
				<div style={{ display: dis }}>
					<AddQuestion {...{ secid, edit, changestates }} />
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{}}
						className={classes.submit}
						onClick={next}
					>
						Submit
					</Button>
				</div>
			</div>
		</div>
	);
}
