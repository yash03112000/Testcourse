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
const useStyles = makeStyles((theme) => ({
	head: {
		backgroundImage: 'url(/static/banner.jpg)',
		height: '80vh',
		width: '100vw',
		backgroundSize: '100% 100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	header: {
		fontSize: 50,
		color: 'white',
	},
	subtitle: {
		fontSize: 20,
		color: 'white',
		width: '50%',
	},
}));

export default function Home({ a, b }) {
	// const router = useRouter();
	const classes = useStyles();
	const editorRef = useRef();
	const [editorLoaded, setEditorLoaded] = useState(false);
	const { CKEditor, ClassicEditor } = editorRef.current || {};

	useEffect(() => {
		console.log('aa');
		editorRef.current = {
			CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
			ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
		};
		setEditorLoaded(true);
	}, []);

	return (
		<>
			{editorLoaded ? (
				<CKEditor
					editor={ClassicEditor}
					data={a}
					onReady={(editor) => {
						// You can store the "editor" and use when it is needed.
						console.log('Editor is ready to use!', editor);
					}}
					onChange={(event, editor) => {
						const data = editor.getData();
						b(data);
					}}
				/>
			) : (
				<p>Carregando...</p>
			)}
		</>
	);
}
