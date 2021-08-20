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
import Drawer from '../../components/Test/Drawer';
import RightDiv from '../../components/Test/RightDiv';
import Question from '../../components/Test/Question';
import Timer from '../../components/Test/Timer';
import { server } from '../../config';
import axios from 'axios';

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
	const [section, setSection] = useState(result.sections[0]);
	const [quesid, setQuesid] = useState(section.questions[0]._id);
	const [quesarr, setQuesarr] = useState(arr);
	// const [time, setTime] = useState(section.timeleft);
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
	const secChange = async (curr) => {
		console.log('quesid');

		if (curr._id !== section._id) {
			var res = await axios.post(`/TestServer/section/change`, {
				newsec: curr._id,
				oldsec: section._id,
				testid,
			});
			if (res.data.status == 200) {
				var da = result;
				var secs = da.sections;
				// console.log(secs);
				for (var i = 0; i < secs.length; i++) {
					if (secs[i]._id === section._id) {
						secs[i].timeleft = res.data.timeleft;
					}
				}
				unstable(() => {
					setResult(da);
					setSection(curr);
					setQuesid(curr.questions[0]._id);
				});
			}
		}
	};

	const timeover = () => {
		var da = result;
		var secs = da.sections;
		for (var i = 0; i < secs.length; i++) {
			if (secs[i]._id === section._id) {
				secs[i].timeleft = 0;
				unstable(() => {
					setResult(da);
					setSection(secs[i]);
				});
				break;
			}
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
				router.push(`/LogIn?next=${router.asPath}`);

				// router.replace('/LogIn');
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
								{result.sections.map((sec, index) => {
									return (
										<Button
											style={{ padding: 5 }}
											key={index}
											onClick={() => {
												secChange(sec);
											}}
											// disabled={sec.timeleft <= 0}
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
										</Button>
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
								<Timer timeleft={section.timeleft} timeover={timeover} />
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
							{section.timeleft > 0 ? (
								<Question
									id={quesid}
									changeresult={changeresult}
									result={result}
									quesarr={quesarr}
									changequesarr={changequesarr}
									section={section}
								/>
							) : (
								<div>
									<h1>
										Time Over for this section. Please Change section or submit
									</h1>
								</div>
							)}
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
	try {
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
		if (data.status == 403) {
			return {
				redirect: {
					destination: '/404',
					permanent: false,
				},
			};
		} else {
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
	} catch (err) {
		console.log('Fetch Request is not returning JSON File');
	}
}
