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
	Checkbox,
	FormControlLabel,
	Modal,
	Backdrop,
	Fade,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { server } from '../../config';
import { ResponsivePie } from '@nivo/pie';
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
	mainform: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
		// height:'100vh'
	},
	header: {
		display: 'flex',
		justifyContent: 'center',
		padding: 30,
		flexDirection: 'column',
		alignItems: 'center',
	},
	graph: {
		height: '60vh',
	},
	tr1: {
		backgroundColor: 'hsl(240,74%,66%)',
	},
	table: {
		width: '60vw',
		backgroundColor: 'hsl(201,87%,63%)',
	},
	tablediv: {
		width: '100vw',
		display: 'flex',
		justifyContent: 'center',
	},
	quesdiv: {
		width: '95vw',
		display: 'flex',
		alignItems: 'space-between',
		margin: 20,
		flexDirection: 'column',
	},
	ques: {
		// display:'flex',
		// flexDirection:'row'
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: '50vw',
		display: 'flex',
		flexDirection: 'column',
	},
	totalmarks: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));

export default function Home({ data }) {
	const [text, setText] = useState('');
	const [load, setLoad] = useState(true);
	const [loadques, setLoadques] = useState(true);
	const [piedata, setPieData] = useState([]);
	const [quesarr, setQuesarr] = useState([]);
	const [sec, setSec] = useState(data.sections[0]);
	const [color, setColors] = useState([
		'hsl(260, 70%, 50%)',
		'hsl(100, 70%, 50%)',
		'hsl(343, 70%, 50%)',
		'hsl(75, 70%, 50%)',
		'hsl(259, 70%, 50%)',
	]);
	const [modal, setModal] = useState(false);
	const [id, setID] = useState('');

	const router = useRouter();
	const classes = useStyles();

	const { id: testid } = router.query;

	useEffect(() => {
		datafun();
		initial();
	}, []);

	const datafun = () => {
		var a = [];
		// console.log(data)
		data.sections.map((sec, i) => {
			var b = {};
			b.id = sec.title;
			// b.title = sec.title;
			b.value = sec.score;
			b.index = i;
			b.color = color[i % color.length];
			a.push(b);
		});
		unstable(() => {
			setPieData(a);
			setLoad(false);
		});
	};

	const initial = () => {
		fetch(`${server}/Testserver/result/questions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					setQuesarr(res.quesarr);
					setLoadques(false);
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const submit = () => {
		console.log('here');
		fetch(`${server}/Testserver/report`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid, id, text }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status == 200) {
						setModal(false);
						setText('');
						setID('');
					}
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	const qtype = (ques, quesdet) => {
		// console.log(quesdet)
		// console.log(ques)
		if (ques.question_type === 'SCQ') {
			var op1 = ques.option_1._id || 'op1';
			var op2 = ques.option_2._id || 'op2';
			var op3 = ques.option_3._id || 'op3';
			var op4 = ques.option_4._id || 'op4';
			var a = {
				[op1]: false,
				[op2]: false,
				[op3]: false,
				[op4]: false,
			};
			var b = {
				[op1]: false,
				[op2]: false,
				[op3]: false,
				[op4]: false,
			};
			// var b = a;
			var i = 0;
			for (i = 0; i < ques.answer.length; i++) b[ques.answer[i]] = true;
			for (i = 0; i < quesdet.user_response.length; i++)
				a[quesdet.user_response[i]] = true;
			console.log(quesdet);
			console.log(ques);
			return (
				<div>
					<div style={{ margin: 10 }}>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black' }}
						>
							{parse(ques.question)}
						</Typography>
						<div className={classes.totalmarks}>
							<Typography
								component="span"
								color="primary"
								variant="subtitle1"
								gutterBottom
								style={{ color: 'black' }}
							>
								Total Marks : {quesdet.marks_correct} Your Score :{' '}
								{quesdet.user_score}
							</Typography>
							<Typography
								style={{ fontSize: 15, cursor: 'pointer' }}
								onClick={() => {
									setID(ques._id);
									setModal(true);
								}}
							>
								Report Any Complaint
							</Typography>
						</div>
						<RadioGroup
							aria-label="quiz"
							name="quiz"
							style={{ color: 'black', padding: 8 }}
						>
							{ques.option_1.valid ? (
								<div>
									<Radio
										checked={b[ques.option_1._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_1._id}
										control={<Radio checked={a[ques.option_1._id]} disabled />}
										label={parse(ques.option_1.content)}
									/>
								</div>
							) : (
								<></>
							)}
							{ques.option_2.valid ? (
								<div>
									<Radio
										checked={b[ques.option_2._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_2._id}
										control={<Radio checked={a[ques.option_2._id]} disabled />}
										label={parse(ques.option_2.content)}
									/>
								</div>
							) : (
								<></>
							)}
							{ques.option_3.valid ? (
								<div>
									<Radio
										checked={b[ques.option_3._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_3._id}
										control={<Radio checked={a[ques.option_3._id]} disabled />}
										label={parse(ques.option_3.content)}
									/>
								</div>
							) : (
								<></>
							)}
							{ques.option_4.valid ? (
								<div>
									<Radio
										checked={b[ques.option_4._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_4._id}
										control={<Radio checked={a[ques.option_4._id]} disabled />}
										label={parse(ques.option_4.content)}
									/>
								</div>
							) : (
								<></>
							)}
						</RadioGroup>
					</div>
				</div>
			);
		} else if (ques.question_type === 'MCQ') {
			var op1 = ques.option_1._id || 'op1';
			var op2 = ques.option_2._id || 'op2';
			var op3 = ques.option_3._id || 'op3';
			var op4 = ques.option_4._id || 'op4';
			var a = {
				[op1]: false,
				[op2]: false,
				[op3]: false,
				[op4]: false,
			};
			var b = {
				[op1]: false,
				[op2]: false,
				[op3]: false,
				[op4]: false,
			};
			var i = 0;
			// console.log(ques.answer)
			for (i = 0; i < ques.answer.length; i++) b[ques.answer[i]] = true;
			for (i = 0; i < quesdet.user_response.length; i++)
				a[quesdet.user_response[i]] = true;
			console.log(b);
			return (
				<div className={classes.sec7}>
					<div style={{ margin: 10 }}>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black' }}
						>
							{parse(ques.question)}
						</Typography>
						<div>
							<Typography
								component="span"
								color="primary"
								variant="subtitle1"
								gutterBottom
								style={{ color: 'black' }}
							>
								Total Marks : {quesdet.marks_correct} Your Score :{' '}
								{quesdet.user_score}
							</Typography>
							<Typography
								style={{ fontSize: 15, cursor: 'pointer' }}
								onClick={() => {
									setID(ques._id);
									setModal(true);
								}}
							>
								Report Any Complaint
							</Typography>
						</div>
						<RadioGroup
							aria-label="quiz"
							name="quiz"
							style={{ color: 'black', padding: 8 }}
						>
							{ques.option_1.valid ? (
								<div>
									<Checkbox
										checked={b[ques.option_1._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_1._id}
										control={
											<Checkbox checked={a[ques.option_1._id]} disabled />
										}
										label={parse(ques.option_1.content)}
									/>
								</div>
							) : (
								<></>
							)}
							{ques.option_2.valid ? (
								<div>
									<Checkbox
										checked={b[ques.option_2._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_2._id}
										control={
											<Checkbox checked={a[ques.option_2._id]} disabled />
										}
										label={parse(ques.option_2.content)}
									/>
								</div>
							) : (
								<></>
							)}
							{ques.option_3.valid ? (
								<div>
									<Checkbox
										checked={b[ques.option_3._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_3._id}
										control={
											<Checkbox checked={a[ques.option_3._id]} disabled />
										}
										label={parse(ques.option_3.content)}
									/>
								</div>
							) : (
								<></>
							)}
							{ques.option_4.valid ? (
								<div>
									<Checkbox
										checked={b[ques.option_4._id]}
										style={{ color: 'green' }}
										disabled
									/>
									<FormControlLabel
										value={ques.option_4._id}
										control={
											<Checkbox checked={a[ques.option_4._id]} disabled />
										}
										label={parse(ques.option_4.content)}
									/>
								</div>
							) : (
								<></>
							)}
						</RadioGroup>
					</div>
				</div>
			);
		} else if (ques.question_type === 'Fill') {
			var b = ques.answer.length > 0 ? ques.answer[0] : '';
			var a = quesdet.user_response[0];
			return (
				<div className={classes.sec7}>
					<div style={{ margin: 10 }}>
						<Typography
							component="span"
							color="primary"
							variant="subtitle1"
							gutterBottom
							style={{ color: 'black' }}
						>
							{parse(ques.question)}
						</Typography>
						<div>
							<Typography
								component="span"
								color="primary"
								variant="subtitle1"
								gutterBottom
								style={{ color: 'black' }}
							>
								Total Marks : {quesdet.marks_correct} Your Score :{' '}
								{quesdet.user_score}
							</Typography>
							<Typography
								style={{ fontSize: 15, cursor: 'pointer' }}
								onClick={() => {
									setID(ques._id);
									setModal(true);
								}}
							>
								Report Any Complaint
							</Typography>
						</div>
						<div style={{ margin: 5, padding: 5 }}>
							<TextField
								style={{ margin: 5, padding: 5, borderColor: 'green' }}
								disabled
								type="username"
								required
								label="Correct Answer"
								name="username"
								variant="outlined"
								size="small"
								autoFocus
								value={b}
							/>
							<TextField
								style={{ margin: 5, padding: 5 }}
								disabled
								type="username"
								required
								label="Your Answer"
								name="username"
								variant="outlined"
								size="small"
								autoFocus
								value={a}
							/>
						</div>
					</div>
				</div>
			);
		}
	};

	const qdis = () => {
		var i;
		var a = [];
		for (i = 0; i < quesarr.length; i++) {
			if (sec._id === quesarr[i].secid) {
				var ques = quesarr[i].ques;
				// console.log(quesarr[i])
				var b = (
					<div key={i} className={classes.ques}>
						{qtype(ques, quesarr[i])}
					</div>
				);

				a.push(b);
			}
		}

		return a;
	};

	const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
		let total = 0;
		dataWithArc.forEach((datum) => {
			total += datum.value;
		});

		return (
			<text
				x={centerX}
				y={centerY}
				textAnchor="middle"
				dominantBaseline="central"
				style={{
					fontSize: '40px',
					fontWeight: '600',
				}}
			>
				{total}
			</text>
		);
	};

	return load ? (
		<h1>Loading..</h1>
	) : (
		<div>
			<Head>
				<title>Result</title>
			</Head>

			<main>
				<div className={classes.mainform}>
					<div className={classes.header}>
						<Typography style={{ fontSize: 40 }}>Your Result is ...</Typography>
						<Typography
							style={{ fontSize: 15, cursor: 'pointer' }}
							onClick={() => {
								setID('Test');
								setModal(true);
							}}
						>
							Report Any Complaint
						</Typography>
					</div>
					<Modal
						aria-labelledby="transition-modal-title"
						aria-describedby="transition-modal-description"
						className={classes.modal}
						open={modal}
						onClose={() => {
							setText('');
							setModal(false);
						}}
						closeAfterTransition
						BackdropComponent={Backdrop}
						BackdropProps={{
							timeout: 500,
						}}
					>
						<Fade in={modal}>
							<div className={classes.paper}>
								<Typography style={{ fontSize: 25 }}>
									Tell us about your complaint about particular Question/Test
								</Typography>
								<TextField
									style={{ margin: 5, padding: 5 }}
									type="username"
									required
									label="Complaint"
									name="username"
									variant="outlined"
									size="small"
									autoFocus
									value={text}
									onChange={(e) => setText(e.target.value)}
								/>
								<Button
									variant="contained"
									style={{ backgroundColor: '#449D44' }}
									onClick={submit}
								>
									Submit
								</Button>
							</div>
						</Fade>
					</Modal>
					<div className={classes.graph}>
						<ResponsivePie
							data={piedata}
							margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
							innerRadius={0.5}
							padAngle={0.7}
							cornerRadius={3}
							activeOuterRadiusOffset={8}
							borderWidth={1}
							borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
							arcLinkLabelsSkipAngle={10}
							arcLinkLabelsTextColor="#333333"
							arcLinkLabelsThickness={2}
							arcLinkLabelsColor={{ from: 'color' }}
							arcLabelsSkipAngle={10}
							arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
							defs={[
								{
									id: 'dots',
									type: 'patternDots',
									background: 'inherit',
									color: 'rgba(255, 255, 255, 0.3)',
									size: 4,
									padding: 1,
									stagger: true,
								},
								{
									id: 'lines',
									type: 'patternLines',
									background: 'inherit',
									color: 'rgba(255, 255, 255, 0.3)',
									rotation: -45,
									lineWidth: 6,
									spacing: 10,
								},
							]}
							legends={[
								{
									anchor: 'bottom',
									direction: 'row',
									justify: false,
									translateX: 0,
									translateY: 56,
									itemsSpacing: 0,
									itemWidth: 140,
									itemHeight: 18,
									itemTextColor: '#999',
									itemDirection: 'left-to-right',
									itemOpacity: 1,
									symbolSize: 18,
									symbolShape: 'circle',
									effects: [
										{
											on: 'hover',
											style: {
												itemTextColor: '#000',
											},
										},
									],
								},
							]}
							layers={[
								'arcs',
								'arcLabels',
								'arcLinkLabels',
								'legends',
								CenteredMetric,
							]}
							onClick={(node, event) => {
								setSec(data.sections[node.data.index]);
							}}
						/>
					</div>
				</div>
				<div className={classes.tablediv}>
					<table className={classes.table}>
						<tr className={classes.tr1}>
							<th colSpan={2}>
								<Typography>{sec.title}</Typography>
							</th>
						</tr>
						<tr>
							<td>
								<Typography>Total Question</Typography>
							</td>
							<td>
								<Typography>{sec.questions.length}</Typography>
							</td>
						</tr>
						<tr>
							<td>
								<Typography>Attempted</Typography>
							</td>
							<td>
								<Typography>{sec.attempt}</Typography>
							</td>
						</tr>
						<tr>
							<td>
								<Typography>Correct Answers</Typography>
							</td>
							<td>
								<Typography>{sec.correct}</Typography>
							</td>
						</tr>
						<tr>
							<td>
								<Typography>Wrong Answers</Typography>
							</td>
							<td>
								<Typography>{sec.attempt - sec.correct}</Typography>
							</td>
						</tr>
					</table>
				</div>
				{loadques ? (
					<div>Loading...</div>
				) : (
					<div className={classes.quesdiv}>{qdis()}</div>
				)}
			</main>
		</div>
	);
}

export async function getServerSideProps(ctx) {
	// console.log(server)
	try {
		var res = await fetch(`${server}/Testserver/result/${ctx.params.id}`, {
			method: 'GET',
			headers: ctx.req
				? { cookie: ctx.req.headers.cookie, 'User-Agent': '*' }
				: undefined,
		});
		if (res.status == 403) {
			return {
				redirect: {
					destination: '/LogIn',
					permanent: false,
				},
			};
		}
		var data = await res.json();

		var a = data.result;

		return {
			props: { data: a }, // will be passed to the page component as props
		};
	} catch (err) {
		console.log('Fetch Request is not returning JSON File');
	}
}
