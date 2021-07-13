import React, { useState, useEffect, useRef } from 'react';
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
// import Vimeo from '@u-wave/react-vimeo';
import parse from 'html-react-parser';
// import Vimeo from '@vimeo/player';

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
		// height: '100%',
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

export default function Home({ lesson }) {
	const router = useRouter();
	const { id } = router.query;
	const classes = useStyles();
	const [load, setLoad] = useState(false);
	const [data, setData] = useState('');
	const aa = useRef(null);

	useEffect(() => {
		if (id) initial();
	}, [id]);

	const initial = () => {
		// console.log(aa.current.offsetWidth);
		var video01Player = new Vimeo.Player('player', {
			id: lesson,
			width: aa.current.offsetWidth,
		});
		// setLoad(false);
	};

	return load ? (
		<div>Lxsxsoading...</div>
	) : (
		<div className={classes.head} id="player" ref={aa}>
			{/* {parse(data)} */}
		</div>
	);
}
