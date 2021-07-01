import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css'
import React, { useState } from 'react';
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
import Drawer from '../../components/Test/Drawer';
import RightDiv from '../../components/Test/RightDiv';
import Question from '../../components/Test/Question';
import { server } from '../../config';

const useStyles = makeStyles((theme) => ({
	mainform: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
	},
	header: {
		backgroundColor: '#363636',
		width: '100vw',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: '5vh',
	},
	headertext: {
		color: '#D8EA4D',
		fontSize: 12,
	},
	maindiv: {
		width: '100vw',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: '95vh',
	},
	maindivleft: {
		flex: 3,
		// backgroundColor:'red',
		display: 'flex',
		flexDirection: 'column',
	},
	sec1: {
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#EEEEEE',
	},
	sec2: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// backgroundColor:'pink'
	},
	sec3: {
		padding: 10,
	},
	sec5: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		backgroundColor: '#38A9EB',
		padding: 8,
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
	},
}));

export default function Home({ test, results, arr }) {
	const [status, setStatus] = useState(false);
	const [data, setData] = useState(test);
	const [result, setResult] = useState(results);
	const [section, setSection] = useState(test.section_id[0]);
	const [quesid, setQuesid] = useState(section.questions[0]._id);
	const [quesarr, setQuesarr] = useState(arr);
	const [modal, setModal] = useState(false);

	//   const [sanswer,setSanswer] = useState('')
	//   const [manswer,setManswer] = useState([]);
	const router = useRouter();
	const classes = useStyles();

	const { id: testid } = router.query;

	//   console.log(data)

	const changeqid = (id) => {
		console.log('quesid');
		if (quesid !== id) setQuesid(id);
	};
	const secChange = (curr) => {
		console.log('quesid');

		if (curr.title !== section.title) {
			unstable(() => {
				setSection(curr);
				setQuesid(curr.questions[0]._id);
			});
		}
	};
	const changeresult = (result, id, data, next) => {
		var i = 0;
		console.log('quesid');

		for (i = 0; i < section.questions.length; i++) {
			if (section.questions[i]._id === id) {
				if (i !== section.questions.length - 1) {
					unstable(() => {
						if (next) setQuesid(section.questions[i + 1]._id);
						setResult(result);
					});
				} else {
					unstable(() => {
						setResult(result);
					});
				}
			}
		}
	};
	const changequesarr = (data) => {
		setQuesarr(data);
	};
	const changeModal = () => {
		setModal(true);
	};
	const submitTest = () => {
		fetch(`${server}/Testserver/submit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testid }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status === 200) {
						router.replace(`/result/${testid}`);
					}
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	return (
		<div>
			<Head>
				<title>TestCourse</title>
			</Head>

			<main>
				<div className={classes.mainform}>
					<div className={classes.header}>
						<div>
							<Typography
								component="span"
								color="primary"
								variant="subtitle1"
								gutterBottom
								className={classes.headertext}
							>
								{data.title}
							</Typography>
						</div>
						<div className={classes.headertextInstruct}>
							<Typography
								component="div"
								align="right"
								color="primary"
								variant="subtitle1"
								gutterBottom
								style={{ color: 'white' }}
							>
								View Instructions
							</Typography>
						</div>
						<Drawer result={result} changeqid={changeqid} section={section} />
						{/* <MenuIcon className={classes.hamicon} /> */}
					</div>
					<div className={classes.maindiv}>
						<div className={classes.maindivleft}>
							<div className={classes.sec1}>
								{data.section_id.map((sec, index) => {
									return (
										<div
											style={{ padding: 5 }}
											key={index}
											onClick={() => {
												secChange(sec);
											}}
										>
											<Typography
												component="span"
												color="primary"
												variant="subtitle1"
												gutterBottom
												style={{
													backgroundColor: '#38A9EB',
													color: 'white',
													padding: 8,
													margin: 10,
													borderRadius: 10,
												}}
											>
												{sec.title}
											</Typography>
										</div>
									);
								})}
							</div>
							<div className={classes.sec2}>
								<div>
									<div>
										<Typography
											component="span"
											color="primary"
											variant="subtitle1"
											gutterBottom
											style={{ color: 'black', margin: 5 }}
										>
											Section
										</Typography>
									</div>
								</div>
								<div>
									<div>
										<Typography
											component="span"
											color="primary"
											variant="subtitle1"
											gutterBottom
											style={{ color: 'black', margin: 5 }}
										>
											Time Left:00:00
										</Typography>
									</div>
								</div>
							</div>
							<div className={classes.sec3}>
								<div>
									<Typography
										component="span"
										color="primary"
										variant="subtitle1"
										gutterBottom
										style={{
											backgroundColor: '#38A9EB',
											color: 'white',
											padding: 8,
											margin: 10,
										}}
									>
										{section.title}
									</Typography>
								</div>
							</div>
							<Question
								id={quesid}
								changeresult={changeresult}
								result={result}
								quesarr={quesarr}
								changequesarr={changequesarr}
								section={section}
							/>
						</div>
						<RightDiv
							result={result}
							changeqid={changeqid}
							section={section}
							changeModal={changeModal}
						/>
					</div>
				</div>
				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className={classes.modal}
					open={modal}
					// onClose={handleClose}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 500,
					}}
				>
					<Fade in={modal}>
						<div className={classes.paper}>
							<h2 id="transition-modal-title">Do You Wanna Submit</h2>
							<Button
								variant="contained"
								style={{ backgroundColor: '#449D44' }}
								onClick={() => submitTest()}
							>
								Submit
							</Button>
							<Button
								variant="contained"
								style={{ backgroundColor: '#E74500' }}
								onClick={() => setModal(false)}
							>
								Cancel
							</Button>
						</div>
					</Fade>
				</Modal>
			</main>
		</div>
	);
}

export async function getServerSideProps(ctx) {
	// console.log(server)
	var res = await fetch(`${server}/Testserver/${ctx.params.id}`, {
		method: 'GET',
		headers: ctx.req
			? { cookie: ctx.req.headers.cookie, 'User-Agent': '*' }
			: undefined,
	});
	if (res.status === 403) {
		return {
			redirect: {
				destination: '/LogIn',
				permanent: false,
			},
		};
	}
	var data = await res.json();
	var test = data.test;
	var result = data.result;
	var arr = [];

	result.sections.map((sec, i) => {
		sec.questions.map((ques) => {
			var a = {};
			a['done'] = false;
			a['_id'] = ques._id;
			a['content'] = {};
			arr.push(a);
		});
	});

	// console.log(result);

	return {
		props: { test, results: result, arr }, // will be passed to the page component as props
	};
}
