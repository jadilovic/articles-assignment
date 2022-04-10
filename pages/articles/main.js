import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useQuery } from 'react-query';
import axios from 'axios';
import Link from 'next/dist/client/link';

const Main = () => {
	let { data, error, isError, isLoading } = useQuery('main', fetchArticles);
	const [initialData, setInitialData] = useState([]);
	const [articles, setArticles] = useState([]);
	const [categories, setCategories] = useState([]);
	const [categoryArticles, setCategoryArticles] = useState([]);
	const [categoryName, setCategoryName] = useState('Show all');
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const categoryNames = {
		1: 'X Universe',
		2: 'Elite: Dangerous',
		3: 'Starpoint Gemini',
		4: 'EVE Online',
	};

	const checkRemovedItems = () => {
		const removedArticles = JSON.parse(
			localStorage.getItem('removedArticlesList')
		);
		if (removedArticles) {
			removedArticles.forEach((article) => {
				if (data.findIndex((item) => item.title === article) !== -1) {
					const index = data.findIndex((item) => item.title === article);
					data.splice(index, 1);
				}
			});
		}
	};

	useEffect(() => {
		if (data) {
			console.log('test');
			setInitialData([...data]);
			checkRemovedItems();
			setArticles([...data]);
			setCategoryArticles([...data]);
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
			setCategoryArticles([...filteredArticles]);
			setCategoryName(categoryNames[id]);
		}
	};

	const handleSearch = (event) => {
		let value = event.target.value.toLowerCase();
		if (value.length < 3) {
			setArticles([...categoryArticles]);
		} else {
			let result = [];
			result = categoryArticles.filter((article) => {
				return article.title.toLowerCase().search(value) !== -1;
			});
			setArticles(result);
		}
	};

	const handleClear = () => {
		document.getElementById('search').value = '';
		setArticles([...data]);
		setCategoryName('Show all');
	};

	const handleRefetch = () => {
		console.log('delete');
		localStorage.removeItem('removedArticlesList');
		data = initialData;
		setArticles([...initialData]);
	};

	const handleRemove = (e) => {
		e.preventDefault();
		console.log(e.target.id);
		articles = articles.filter((item) => item.post_category_id !== e.target.id);
		setArticles([...articles]);
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
			<label>Search:</label>
			<input
				onChange={(event) => handleSearch(event)}
				type="text"
				id="search"
				name="search"
			/>
			<button onClick={() => handleClear()}>Clear</button>
			<h4>{`Total number of articles: ${articles.length}`}</h4>
			<button onClick={handleRefetch}>Refetch</button>{' '}
			<div>
				<Button
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
				>
					Categories
				</Button>
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					{categories.map((category) => {
						return (
							<MenuItem key={category} onClick={handleClose}>
								{categoryNames[category]}
								<Button
									id={category}
									variant="contained"
									onClick={handleRemove}
								>
									Remove
								</Button>
							</MenuItem>
						);
					})}
				</Menu>
			</div>
			{articles.map((article, index) => {
				return (
					<li style={{ margin: 4 }} key={index}>
						<Link
							href={{
								pathname: '/articles/article',
								query: article,
							}}
						>
							{article.title}
						</Link>
					</li>
				);
			})}
		</div>
	);
};

async function fetchArticles() {
	console.log('fetch');
	const { data } = await axios.get(
		'https://www.alpha-orbital.com/last-100-news.json'
	);
	return data;
}

export default Main;
