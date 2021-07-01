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
	const [qtype, setQtype] = useState('SCQ');
	const [quesBody, setQuesBody] = useState('');
	const [answer, setAnswer] = useState('');
	const [optionBody, setOptionBody] = useState('');
	const [options, setOptions] = useState([]);
	const [valid, setValid] = useState(false);
	const [markCorrect, setMarkCorrect] = useState(0);
	const [markIncorrect, setMarkIncorrect] = useState(0);
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();

	const quesBodyChange = (value) => {
		setQuesBody(value);
	};
	const optionBodyChange = (value) => {
		setOptionBody(value);
	};

	const uploadOpt = () => {
		// setMsg(false);
		if (quesBody !== '') {
			var a = {};
			a['body'] = optionBody;
			a['correct'] = valid;
			setOptions((options) => [...options, a]);
			setOptionBody('');
			setValid(false);
		}
	};

	const hasAns = () => {
		var bool = false;
		options.forEach((option) => {
			if (option.correct) bool = true;
		});
		return bool;
	};

	const uploadQues = () => {
		var a = {};
		if (
			quesBody !== '' &&
			secid !== '' &&
			markCorrect > 0 &&
			markIncorrect <= 0
		) {
			if (
				(qtype === 'Fill' && answer !== '') ||
				(options.length > 0 && hasAns())
			) {
				fetch(`/AddTestServer/addQuestion`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: edit,
						ques: quesBody,
						options: options,
						qtype: qtype,
						answer: answer,
						secid,
						markCorrect,
						markIncorrect,
					}),
				}).then((res) => {
					if (res.status === 200) {
						res.json().then((res) => {
							if (res.status === 200) {
								// setData(res.sections);
								// setLoad(false);
								changestates('data', res.sections);
								changestates('dis', 'none');
								changestates('secid', '');
								setQuesBody('');
								setOptions([]);
							}
						});
					} else if (res.status == 403) {
						router.replace('/LogIn');
					}
				});
			}
		}
	};

	const cancheck = () => {
		var i;
		var bool = false;
		for (i = 0; i < options.length; i++) {
			if (options[i].correct === true) bool = true;
		}
		if (!bool) {
			return (
				<div>
					<FormControlLabel
						control={
							<Switch
								checked={valid}
								onChange={() => setValid(!valid)}
								name="checkedA"
							/>
						}
						label="IsCorrect"
					/>
				</div>
			);
		} else {
			return (
				<div>
					<Typography>only One Option Can be selected</Typography>
				</div>
			);
		}
	};

	const qtypefun = () => {
		if (qtype === 'Fill') {
			return (
				<>
					<div style={{ marginTop: 10 }}>
						<Typography>Upload the Answer:</Typography>
					</div>
					<div style={{ marginTop: 10 }}>
						<TextField
							type="username"
							required
							label="Answer"
							name="username"
							variant="outlined"
							size="small"
							autoFocus
							value={answer}
							onChange={(e) => {
								setAnswer([e.target.value]);
							}}
							InputProps={{}}
						/>
					</div>
				</>
			);
		} else if (qtype === 'SCQ') {
			if (options.length >= 4) {
				return (
					<div>
						<Typography>Only 4 Options Allowed</Typography>
					</div>
				);
			} else {
				return (
					<div>
						<div style={{ marginTop: 10 }}>
							<Typography>Upload the Options:</Typography>
						</div>

						<div style={{ marginTop: 10 }}>
							<Editor a={optionBody} b={optionBodyChange} />
						</div>
						{cancheck()}
					</div>
				);
			}
		} else if (qtype === 'MCQ') {
			if (options.length >= 4) {
				return (
					<div>
						<Typography>Only 4 Options Allowed</Typography>
					</div>
				);
			} else {
				return (
					<div>
						<div style={{ marginTop: 10 }}>
							<Typography>Upload the Options:</Typography>
						</div>

						<div style={{ marginTop: 10 }}>
							<Editor a={optionBody} b={optionBodyChange} />
						</div>
						<div>
							<FormControlLabel
								control={
									<Switch
										checked={valid}
										onChange={() => setValid(!valid)}
										name="checkedA"
									/>
								}
								label="IsCorrect"
							/>
						</div>
					</div>
				);
			}
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
					// width: '60%',
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
						Add Question
					</Typography>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Typography
						component="span"
						color="primary"
						variant="subtitle1"
						gutterBottom
						style={{ color: 'black', margin: 6 }}
					>
						Question Type:
					</Typography>
					<Select
						labelId="demo-simple-select-helper-label"
						id="demo-simple-select-helper"
						onChange={(e) => setQtype(e.target.value)}
						value={qtype}
						style={{ width: 100 }}
					>
						<MenuItem value={'SCQ'}>SCQ</MenuItem>
						<MenuItem value={'MCQ'}>MCQ</MenuItem>
						<MenuItem value={'Fill'}>Fill</MenuItem>
					</Select>
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
						MarksCorrect:
					</Typography>
					<TextField
						type="number"
						required
						label="Marks Correct"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={markCorrect}
						style={{ width: '20%' }}
						onChange={(e) => setMarkCorrect(e.target.value)}
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
						MarksInCorrect:
					</Typography>
					<TextField
						type="number"
						required
						label="Marks Incorrect"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={markIncorrect}
						style={{ width: '20%' }}
						onChange={(e) => setMarkIncorrect(e.target.value)}
					/>
				</div>
				<div style={{ marginTop: 10 }}>
					<Typography>Question:</Typography>
					<Typography component="div">{parse(quesBody)}</Typography>
				</div>
				{options.map((opt, i) => {
					return (
						<div key={i}>
							<div>
								<FormControlLabel
									control={<Checkbox checked={opt.correct} disabled />}
									label={parse(opt.body)}
								/>
								{/* <Typography>{parse(opt.body)}</Typography> */}
							</div>
						</div>
					);
				})}
				<div
					style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}
				>
					<div style={{ marginTop: 10 }}>
						<Typography>Upload the question:</Typography>
					</div>
					<Editor a={quesBody} b={quesBodyChange} />
				</div>
				{qtypefun()}
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						marginTop: 10,
					}}
				>
					{qtype !== 'Fill' ? (
						<Button
							color="primary"
							variant="contained"
							type="submit"
							style={{}}
							className={classes.submit}
							onClick={uploadOpt}
						>
							Upload Option
						</Button>
					) : (
						<></>
					)}

					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{ marginLeft: 10 }}
						className={classes.submit}
						onClick={uploadQues}
					>
						Upload Question
					</Button>
				</div>
			</div>
		</div>
	);
}
