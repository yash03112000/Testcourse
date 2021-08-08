import Head from 'next/head';
import Link from 'next/link';
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
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

export default function AddQuestion({
	secid,
	edit,
	changestates,
	isTest,
	isold,
	olddetail,
	les,
	quesid,
}) {
	const [load, setLoad] = useState(false);
	const [qtype, setQtype] = useState('SCQ');
	const [quesBody, setQuesBody] = useState('');
	const [answer, setAnswer] = useState('');
	const [optionBody, setOptionBody] = useState('');
	const [options, setOptions] = useState([]);
	const [valid, setValid] = useState(false);
	const [markCorrect, setMarkCorrect] = useState(0);
	const [optid, setOptid] = useState('');
	const [markIncorrect, setMarkIncorrect] = useState(0);
	// const [old, setOld] = useState(olddetail);
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();

	const quesBodyChange = (value) => {
		setQuesBody(value);
	};
	const optionBodyChange = (value) => {
		setOptionBody(value);
	};

	const initial = async () => {
		// console.log(les);
		// setQtype(old.question_type);
		// setQuesBody(old.question);
		// // setAnswer(old.answer[0]);
		// var a = [];
		// old.option_1.valid ? a.push(option_1) : 'a';
		// old.option_2.valid ? a.push(option_2) : 'a';
		// old.option_3.valid ? a.push(option_3) : 'a';
		// old.option_4.valid ? a.push(option_4) : 'a';
		// setOptions(a);
		// setMarkIncorrect(les.marks_incorrect);
		// setMarkCorrect(les.marks_correct);
		try {
			var res = await axios.get(`/AddTestServer/question/edit/${quesid}`);
			if (res.status == 404) {
			} else if (res.status == 403) {
				router.push('/LogIn');
			} else {
				// console.log(res.data.ques);
				const old = res.data.ques;
				setQtype(old.question_type);
				setQuesBody(old.question);
				setAnswer(old.answer[0]);
				var a = [];
				if (old.option_1.valid) {
					var b = {};
					b.body = old.option_1.content;
					b.correct = false;
					b._id = old.option_1._id;
					var i;
					for (i = 0; i < old.answer.length; i++) {
						if (old.option_1._id == old.answer[i]) b.correct = true;
					}
					a.push(b);
				}
				if (old.option_2.valid) {
					var b = {};
					b.body = old.option_2.content;
					b.correct = false;
					b._id = old.option_3._id;

					var i;
					for (i = 0; i < old.answer.length; i++) {
						if (old.option_2._id == old.answer[i]) b.correct = true;
					}
					a.push(b);
				}
				if (old.option_3.valid) {
					var b = {};
					b.body = old.option_3.content;
					b.correct = false;
					b._id = old.option_3._id;

					var i;
					for (i = 0; i < old.answer.length; i++) {
						if (old.option_3._id == old.answer[i]) b.correct = true;
					}
					a.push(b);
				}
				if (old.option_4.valid) {
					var b = {};
					b.body = old.option_4.content;
					b.correct = false;
					b._id = old.option_4._id;
					var i;
					for (i = 0; i < old.answer.length; i++) {
						if (old.option_4._id == old.answer[i]) b.correct = true;
					}
					a.push(b);
				}
				// console.log(les);
				setOptions(a);
				setMarkIncorrect(les.marks_incorrect);
				setMarkCorrect(les.marks_correct);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useMemo(() => {
		if (isold) initial();
	}, [isold]);

	// console.log(old);

	const uploadOpt = () => {
		// setMsg(false);
		if (quesBody !== '') {
			var a = {};
			a['body'] = optionBody;
			a['correct'] = valid;
			a['_id'] = uuidv4();
			var opts = [...options];
			if (optid !== '') {
				for (var i = 0; i < opts.length; i++) {
					if (opts[i]._id === optid) {
						opts[i] = a;
					}
				}
			} else {
				opts.push(a);
			}
			setOptions(opts);
			setOptionBody('');
			setValid(false);
			setOptid('');
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
		if (quesBody !== '' && markCorrect > 0 && markIncorrect <= 0) {
			if (
				(qtype === 'Fill' && answer !== '') ||
				(options.length > 0 && hasAns())
			) {
				if (!isTest) {
					fetch(`/QuestionServer/addQuestion`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							ques: quesBody,
							options: options,
							qtype: qtype,
							answer: answer,
							markCorrect,
							markIncorrect,
							isold,
							quesid,
						}),
					}).then((res) => {
						if (res.status === 200) {
							res.json().then((res) => {
								if (res.status === 200) {
									// setData(res.sections);
									// setLoad(false);
									// changestates('data', res.sections);
									// changestates('dis', 'none');
									// changestates('secid', '');
									setQuesBody('');
									setOptions([]);
								}
							});
						} else if (res.status == 403) {
							router.replace('/LogIn');
						}
					});
				} else {
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
							isold,
							quesid,
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
		}
	};

	const cancheck = () => {
		var i;
		var bool = false;
		for (i = 0; i < options.length; i++) {
			if (options[i].correct === true && options[i]._id !== optid) bool = true;
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
					width: '60%',
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
					<div className="ck-content">{parse(quesBody)}</div>
					{/* <Typography component="div">{quesBody}</Typography> */}
				</div>
				{options.map((opt, i) => {
					return (
						<div
							key={i}
							style={{
								display: 'flex',
								flexDirection: 'row',
								width: '100%',
								justifyContent: 'space-around',
								alignItems: 'center',
							}}
						>
							<div>
								<FormControlLabel
									control={<Checkbox checked={opt.correct} disabled />}
									label={parse(opt.body)}
								/>
								{/* <Typography>{parse(opt.body)}</Typography> */}
							</div>
							<div
								onClick={() => {
									setOptionBody(opt.body);
									setValid(opt.correct);
									setOptid(opt._id);
								}}
							>
								Edit
							</div>
						</div>
					);
				})}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginTop: 20,
						width: '100%',
					}}
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
