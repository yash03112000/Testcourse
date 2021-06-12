import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
	Badge,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Vimeo from '@u-wave/react-vimeo';
import Curriculum from './Curriculum';

const useStyles = makeStyles((theme) => ({
	head: {
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'row',
		// alignItems: 'center',
		width: '100%',
		// marginTop: 40,
		[theme.breakpoints.down('sm')]: {
			// flexDirection: 'column',
			// height: '15vh',
			flexDirection: 'column',
		},
		height: '80vh',
	},
	left: {
		// flex: 2.5,
		// backgroundColor: 'black',
		// height: '80vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	right: {
		// flex: 1,
		// height: '80vh',
		width: '50%',
		height: '100%',
		// backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			// flexDirection: 'column',
			// height: '15vh',
			// flexDirection: 'column',
			width: '100%',
		},
	},
}));

export default function Home({}) {
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();
	const [load, setLoad] = useState(true);
	const [data, setData] = useState([]);
	const [lesson, setLesson] = useState([]);
	const [status, setStatus] = useState(false);
	// const id = '60bfd3be0ad51c1ffc3fea10';

	useEffect(() => {
		if (id) initial();
	}, [id]);

	const initial = () => {
		setLoad(true);
		fetch(`/CourseServer/lessondata`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		}).then((res) => {
			// console.log(res.status)
			if (res.status === 200) {
				res.json().then((res) => {
					// setUser(res.user);
					setData(res.data);
					setLesson(res.lesson);
					setStatus(true);
					setLoad(false);
				});
			} else if (res.status == 403) {
				router.replace('/LogIn');
			}
		});
	};

	return load ? (
		<div>Loading...</div>
	) : (
		<div className={classes.head}>
			<div className={classes.left}>
				<Vimeo
					video={lesson}
					// autoplay
					responsive={true}
					// style={{ width: 680, backgroundColor: 'red' }}
					// width={600}
					// height={800}
				/>
			</div>
			<div className={classes.right}>
				<Curriculum data={data} />
			</div>
		</div>
	);
}
