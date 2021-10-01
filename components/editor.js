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
import AccountBoxIcon from '@material-ui/icons/AccountBox';
// import Image from '@ckeditor/ckeditor5-image/src/image';
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
			CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
			ClassicEditor: require('ckeditor5-custom-build/build/ckeditor'),
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
									'x-access-token': localStorage.getItem('token'),
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

	const editorConfiguration = {
		toolbar: {
			items: [
				'heading',
				'|',
				// 'fontfamily',
				'fontsize',
				'|',
				'alignment',
				'|',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				// 'strikethrough',
				'underline',
				'subscript',
				'superscript',
				'|',
				'link',
				'|',
				'outdent',
				'indent',
				'|',
				'bulletedList',
				'numberedList',
				// 'todoList',
				'|',
				'code',
				'codeBlock',
				'|',
				'insertTable',
				'|',
				'uploadImage',
				'blockQuote',
				'|',
				'undo',
				'redo',
			],
			shouldNotGroupWhenFull: true,
		},
		image: {
			insert: {
				type: 'inline',
			},
			style: {
				options: [
					'alignLeft',
					'alignCenter',
					'alignRight',
					'inline',
					'block',
					// {
					// 	name: 'inline2',
					// 	// icon: AccountBoxIcon,
					// 	title: 'Inline Image',
					// 	className: 'image-inline',
					// 	modelElements: ['imageInline'],
					// },
					'side',
				],
			},
			resizeUnit: '%',
			resizeOptions: [
				{
					name: 'resizeImage:original',
					label: 'Original',
					value: null,
				},
				{
					name: 'resizeImage:50',
					label: '50%',
					value: '50',
				},
				{
					name: 'resizeImage:75',
					label: '75%',
					value: '75',
				},
			],
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'|',
				'imageStyle:alignLeft',
				'imageStyle:alignCenter',
				'imageStyle:alignRight',
				'imageStyle:side',
				'|',
				'resizeImage',
				'|',
				'imageTextAlternative',
			],
		},
	};

	return (
		<>
			{editorLoaded ? (
				<div
					style={{
						width: '90%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
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
						config={editorConfiguration}
						// config={{
						// 	// plugins: [ImageResizer],
						// 	image: {
						// 		styles: ['alignLeft', 'alignCenter', 'alignRight'],
						// 		resizeUnit: '%',
						// 		resizeOptions: [
						// 			{
						// 				name: 'resizeImage:original',
						// 				label: 'Original',
						// 				value: null,
						// 			},
						// 			{
						// 				name: 'resizeImage:50',
						// 				label: '50%',
						// 				value: '50',
						// 			},
						// 			{
						// 				name: 'resizeImage:75',
						// 				label: '75%',
						// 				value: '75',
						// 			},
						// 		],
						// 		toolbar: [
						// 			'imageStyle:alignLeft',
						// 			'imageStyle:alignCenter',
						// 			'imageStyle:alignRight',
						// 			'|',
						// 			'resizeImage',
						// 			'|',
						// 			'imageTextAlternative',
						// 		],
						// 	},
						// }}
						onChange={(event, editor) => {
							const data = editor.getData();
							b(data);
						}}
						// style={{ width: '90%' }}
					/>
				</div>
			) : (
				<p>Carregando...</p>
			)}
		</>
	);
}
