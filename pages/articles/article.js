/* eslint-disable @next/next/link-passhref */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Article = () => {
	const [style, setStyle] = useState({ display: 'none' });
	const [removedArticles, setRemovedArticles] = useState([]);
	const router = useRouter();
	const query = router.query;
	console.log(query);

	useEffect(() => {
		const removedArticlesList = JSON.parse(
			localStorage.getItem('removedArticlesList')
		);
		if (removedArticlesList) {
			setRemovedArticles(removedArticlesList);
		}
	}, []);

	const deleteArticle = () => {
		removedArticles.push(query.title);
		setRemovedArticles([...removedArticles]);
		localStorage.setItem(
			'removedArticlesList',
			JSON.stringify(removedArticles)
		);
	};
	return (
		<>
			<div
				style={{
					float: 'right',
					border: '1px solid gray',
					padding: 20,
					margin: 20,
				}}
				onMouseEnter={(e) => {
					setStyle({ display: 'block' });
				}}
				onMouseLeave={(e) => {
					setStyle({ display: 'none' });
				}}
			>
				<Link
					href={{
						pathname: '/articles/main',
						query: query.title,
					}}
				>
					<button onClick={deleteArticle} style={style}>
						Delete
					</button>
				</Link>
			</div>
			<div>
				<h1>{query.title}</h1>
				<h4>{query.date}</h4>
				<div dangerouslySetInnerHTML={{ __html: query.excerpt }}></div>
			</div>
		</>
	);
};

export default Article;
