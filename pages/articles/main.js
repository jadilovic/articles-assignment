import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Link from 'next/dist/client/link';

const Main = () => {
	let { data, error, isError, isLoading } = useQuery('main', fetchArticles);
	const [articles, setArticles] = useState([]);
	const [categories, setCategories] = useState([]);
	const [categoryName, setCategoryName] = useState('Show all');
	const categoryNames = {
		1: 'X Universe',
		2: 'Elite: Dangerous',
		3: 'Starpoint Gemini',
		4: 'EVE Online',
	};

	useEffect(() => {
		if (data) {
			console.log('test');
			setArticles([...data]);
			data.forEach((article) => {
				if (categories.indexOf(article.post_category_id) === -1) {
					categories.push(article.post_category_id);
				}
			});
			setCategories([...categories.sort()]);
		}
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error! {error.message}</div>;
	}

	const handleCategory = (id) => {
		if (id === '5') {
			setArticles([...data]);
			setCategoryName('Show all');
		} else {
			const filteredArticles = data.filter(
				(article) => article.post_category_id === id
			);
			setArticles([...filteredArticles]);
			setCategoryName(categoryNames[id]);
		}
	};

	const handleSearch = (event) => {
		let value = event.target.value;
		let result = [];
		result = articles.filter((article) => {
			return article.title.search(value) !== -1;
		});
		setArticles(result);
	};

	const handleClear = () => {
		document.getElementById('search').value = '';
		setArticles([...data]);
		setCategoryName('Show all');
	};

	return (
		<div className="container">
			<nav>
				<Link href={'/'}>
					<button>Back to Home</button>
				</Link>{' '}
				<button onClick={() => handleCategory('5')}>Show all</button>{' '}
				{categories.map((category) => {
					return (
						<button
							style={{ margin: 4 }}
							key={category}
							onClick={() => handleCategory(category)}
						>
							{categoryNames[category]}
						</button>
					);
				})}
			</nav>

			<h1>Articles</h1>
			<h3>{`Category: ${categoryName}`}</h3>
			<h4>{`Total number of articles: ${articles.length}`}</h4>

			<label>Search:</label>
			<input
				onChange={(event) => handleSearch(event)}
				type="text"
				id="search"
				name="search"
			/>
			<button onClick={() => handleClear()}>Clear</button>
			{articles.map((article, index) => {
				return <li key={index}>{article.title}</li>;
			})}
		</div>
	);
};

async function fetchArticles() {
	const { data } = await axios.get(
		'https://www.alpha-orbital.com/last-100-news.json'
	);
	return data;
}

export default Main;
