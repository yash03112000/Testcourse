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
	Checkbox,
	Modal,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';

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
	const [free, setFree] = useState(false);
	const [sale, setSale] = useState(false);
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState(0);
	const [saleprice, setSalePrice] = useState(0);
	const [msg, setMsg] = useState(false);
	const router = useRouter();
	const [file, setFile] = useState(null);
	// const { id } = router.query;
	const classes = useStyles();

	useEffect(() => {
		if (!isNew) initial();
	}, []);

	const initial = () => {
		fetch(`/AddDigitalServer/step0/${edit}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					if (res.status === 200) {
						setPrice(res.test.price);
						setFree(res.test.free);
						setSalePrice(res.test.sale_price);
						setSale(res.test.is_on_sale);
						setTitle(res.test.title);
						setLoad(false);
					}
				});
			} else if (res.status == 403) {
				router.push(`/LogIn?next=${router.asPath}`);

				// router.replace('/LogIn');
			}
		});
	};

	const next = () => {
		if (title === '' && file === null) {
			setMsg(true);
			return;
		} else {
			if (!free) {
				if (price === 0 || price === '') {
					setMsg(true);
					return;
				} else {
					if (sale) {
						if (saleprice === 0 || saleprice === '') {
							setMsg(true);
							return;
						}
					}
				}
			}
		}

		setMsg(false);
		const formData = new FormData();
		// formData.append('name', title);
		formData.append('file', file);
		fetch(`/AddDigitalServer/step0`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				free,
				sale,
				title,
				price,
				saleprice,
				edit,
			}),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					axios
						.post('/AddDigitalServer/uploadfile/' + res.id, formData, {
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': localStorage.getItem('token'),
							},
						})
						.then((res) => {
							// console.log(res.status)
							if (res.status === 200) {
								// res.json().then((res) => {
								router.replace('/teacherdashboard');
								// });
							} else if (res.status == 403) {
								router.push(`/LogIn?next=${router.asPath}`);

								// router.replace('/LogIn');
							}
						});
				});
			} else if (res.status == 403) {
				router.push(`/LogIn?next=${router.asPath}`);

				// router.replace('/LogIn');
			}
		});
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
				<div className={classes.row}>
					<Typography>Title</Typography>
					<TextField
						type="username"
						required
						label=""
						name="Password"
						variant="outlined"
						size="small"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className={classes.row}>
					<Typography>Free</Typography>
					<div className={classes.row}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Typography>True</Typography>
							<Radio
								checked={free}
								onChange={(e) => {
									setFree(true);
								}}
							/>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Typography>False</Typography>
							<Radio
								checked={!free}
								onChange={(e) => {
									setFree(false);
								}}
							/>
						</div>
					</div>
				</div>
				{free ? (
					<></>
				) : (
					<div>
						<div style={{ color: 'red' }}>All Prices are GST included</div>

						<div className={classes.row}>
							<Typography>Price</Typography>
							<TextField
								type="number"
								required
								label=""
								name="Password"
								variant="outlined"
								size="small"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>
						<div className={classes.row}>
							<Typography>On Sale</Typography>
							<div className={classes.row}>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<Typography>True</Typography>
									<Radio
										checked={sale}
										onChange={(e) => {
											setSale(true);
										}}
									/>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<Typography>False</Typography>
									<Radio
										checked={!sale}
										onChange={(e) => {
											setSale(false);
										}}
									/>
								</div>
							</div>
						</div>
						{!sale ? (
							<></>
						) : (
							<div>
								<div className={classes.row}>
									<Typography>Sale Price</Typography>
									<TextField
										type="number"
										required
										label=""
										name="Password"
										variant="outlined"
										size="small"
										value={saleprice}
										onChange={(e) => setSalePrice(e.target.value)}
									/>
								</div>
							</div>
						)}
					</div>
				)}
				<div className={classes.row}>
					<Typography>Upload File</Typography>
					{/* <TextField
						type="username"
						required
						label=""
						name="Password"
						variant="outlined"
						size="small"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/> */}
					<input
						type="file"
						// value={file}
						onChange={(e) => setFile(e.target.files[0])}
					/>
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
						Upload
					</Button>
				</div>
			</div>
		</div>
	);
}
