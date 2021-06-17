import Head from 'next/head';
import Link from 'next/link';
// import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Typography,
	Divider,
	InputAdornment,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import Vimeo from '@u-wave/react-vimeo';

export default function Home() {
	const [load, setLoad] = useState(true);
	const router = useRouter();
	const { id } = router.query;
	useEffect(() => {
		if (id) initial();
	}, [id]);
	const initial = () => {
		setLoad(false);
	};

	return load ? (
		<div>Loading..</div>
	) : (
		<div>
			<Head>
				<title>TestCourse</title>
			</Head>
			<Vimeo
				video={id}
				// autoplay
				responsive={true}
				// style={{ width: 680, backgroundColor: 'red' }}
				// width={600}
				// height={800}
			/>
		</div>
	);
}
