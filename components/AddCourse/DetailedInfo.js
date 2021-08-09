import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import ReactDOM, { unstable_batchedUpdates as unstable } from 'react-dom';
import { TextField, Button, Typography, Chip } from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Editor from '../editor';

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
}));

export default function Home({ changestep, isNew, edit }) {
	const [load, setLoad] = useState(false);
	const [desc, setDesc] = useState('');
	const [title, setTitle] = useState('');
	const [title2, setTitle2] = useState('');
	const [title3, setTitle3] = useState('');
	const [requirements, setRequirements] = useState([]);
	const [tags, setTags] = useState([]);
	const [outcomes, setOutcomes] = useState([]);
	const [msg, setMsg] = useState(false);
	const router = useRouter();
	// const { id } = router.query;
	const classes = useStyles();

	useEffect(() => {
		if (!isNew) initial();
	}, []);

	const initial = () => {
		fetch(`/AddCourseServer/step1/${edit}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status === 200) {
						setDesc(res.course.short_description);
						setRequirements(res.course.requirements);
						setTags(res.course.tags);
						setOutcomes(res.course.outcomes);
						setLoad(false);
					}
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const next = () => {
		fetch(`/AddCourseServer/step1`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: edit, requirements, outcomes, tags, desc }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					// setTests(res.tests);
					// setLoad(false);
					changestep(2, res.id);
				});
			} else if (res.status == 403) {
				router.push(`/LogIn?next=${router.asPath}`);

				// router.replace('/LogIn');
			}
		});
	};

	const DescChange = (value) => {
		setDesc(value);
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
				{msg ? (
					<div className={classes.row}>
						<Typography style={{ color: 'red' }}>
							Please Fill All Fields
						</Typography>
					</div>
				) : (
					<></>
				)}
				<div className={classes.column}>
					<Typography>Short Description:</Typography>
					<div style={{ marginTop: 10 }}>
						<Editor a={desc} b={DescChange} />
					</div>
				</div>
				<div className={classes.column}>
					<Typography>Requirments:</Typography>
					<ul>
						{requirements.map((req, i) => {
							return <li key={i}>{req}</li>;
						})}
					</ul>

					<div style={{ marginTop: 10, width: '90%' }}>
						<TextField
							type="username"
							required
							label="Requirments"
							name="Password"
							variant="outlined"
							size="small"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							style={{ width: '100%' }}
						/>
					</div>
					<div className={classes.row}>
						<Button
							color="primary"
							variant="contained"
							type="submit"
							style={{}}
							className={classes.submit}
							onClick={() => {
								setRequirements((prev) => [...prev, title]);
								setTitle('');
							}}
						>
							Upload Requirement
						</Button>
					</div>
				</div>

				<div className={classes.column}>
					<Typography>Outcomes:</Typography>
					<ul>
						{outcomes.map((req, i) => {
							return <li key={i}>{req}</li>;
						})}
					</ul>

					<div style={{ marginTop: 10, width: '90%' }}>
						<TextField
							type="username"
							required
							label="Outcomes"
							name="Password"
							variant="outlined"
							size="small"
							value={title3}
							onChange={(e) => setTitle3(e.target.value)}
							style={{ width: '100%' }}
						/>
					</div>
					<div className={classes.row}>
						<Button
							color="primary"
							variant="contained"
							type="submit"
							style={{}}
							className={classes.submit}
							onClick={() => {
								setOutcomes((prev) => [...prev, title3]);
								setTitle3('');
							}}
						>
							Upload Outcomes
						</Button>
					</div>
				</div>

				<div className={classes.column}>
					<Typography>Tags:</Typography>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						{tags.map((tag, i) => {
							return (
								<Chip
									color="primary"
									size="medium"
									label={tag}
									style={{ marginRight: 5 }}
								/>
							);
						})}
					</div>

					<div style={{ marginTop: 10, width: '90%' }}>
						<TextField
							type="username"
							required
							label="Tags"
							name="Password"
							variant="outlined"
							size="small"
							value={title2}
							onChange={(e) => setTitle2(e.target.value)}
							style={{ width: '100%' }}
						/>
					</div>
					<div className={classes.row}>
						<Button
							color="primary"
							variant="contained"
							type="submit"
							style={{}}
							className={classes.submit}
							onClick={() => {
								setTags((prev) => [...prev, title2]);
								setTitle2('');
							}}
						>
							Upload Tag
						</Button>
					</div>
				</div>

				<div className={classes.row}>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{}}
						className={classes.submit}
						onClick={next}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
