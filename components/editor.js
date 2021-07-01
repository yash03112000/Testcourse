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

	class MyUploadAdapter {
		constructor(loader) {
			this.loader = loader;
		}
		// Starts the upload process.
		upload() {
			return this.loader.file.then(
				(file) =>
					new Promise((resolve, reject) => {
						var reader = new FileReader();
						reader.readAsDataURL(file);
						reader.onload = () => {
							fetch(`/ImageServer/imageupload`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ data: reader.result }),
							})
								.then((res) => res.json())
								.then((res) => {
									resolve({
										default: `ImageServer/ImageSearch/${res.id}.png`,
									});
								})
								.catch((err) => {
									console.log(err);
								});
						};
					})
			);
		}
	}

	return (
		<>
			{editorLoaded ? (
				<div style={{ width: '90%' }}>
					<CKEditor
						editor={ClassicEditor}
						data={a}
						onReady={(editor) => {
							// You can store the "editor" and use when it is needed.
							console.log('Editor is ready to use!', editor);
							editor.plugins.get('FileRepository').createUploadAdapter = (
								loader
							) => {
								return new MyUploadAdapter(loader);
							};
						}}
						onChange={(event, editor) => {
							const data = editor.getData();
							b(data);
						}}
						style={{ width: '90%' }}
					/>
				</div>
			) : (
				<p>Carregando...</p>
			)}
		</>
	);
}
