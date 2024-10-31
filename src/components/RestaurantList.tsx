import React, { useEffect, useState } from "react";
import { ListGroup, Container, Form, Dropdown, Spinner, Alert } from "react-bootstrap";
import { getRestaurants } from "../services/api";

export type RestaurantDetailData = {
	id: number;
	address: string;
	openingHours: {
		weekday: string;
		weekend: string;
	};
	reviewScore: number;
	contactEmail: string;
};

type Restaurant = {
	id: number;
	name: string;
	shortDescription: string;
	cuisine: string;
	rating: number;
	details: RestaurantDetailData;
};
type RestaurantListProps = {
	onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({ onRestaurantSelect }) => {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortOption, setSortOption] = useState<"name" | "rating">("name");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRestaurants = async () => {
		setLoading(true);
		setError(null);
		try {
			const returnedRestaurants: Restaurant[] = await getRestaurants();
			setRestaurants(returnedRestaurants);
		} catch (err) {
			setError("Failed to fetch restaurants. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRestaurants();
	}, []);

	const filteredRestaurants = restaurants
		.filter(restaurant => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => {
			if (sortOption === "name") {
				return a.name.localeCompare(b.name);
			} else {
				return b.rating - a.rating; // Assuming higher rating is better
			}
		});

	return (
		<Container>
			<h2>Restaurants</h2>
			<Form>
				<Form.Group controlId="search">
					<Form.Control
						type="text"
						placeholder="Search by name"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</Form.Group>
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						Sort by: {sortOption === "name" ? "Name" : "Rating"}
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item onClick={() => setSortOption("name")}>Name</Dropdown.Item>
						<Dropdown.Item onClick={() => setSortOption("rating")}>Rating</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Form>

			{loading && (
				<div className="text-center">
					<Spinner animation="border" />
				</div>
			)}

			{error && <Alert variant="danger">{error}</Alert>}

			<ListGroup>
				{!loading && !error && filteredRestaurants.length === 0 && (
					<ListGroup.Item>No restaurants found.</ListGroup.Item>
				)}
				{filteredRestaurants.map(restaurant => (
					<ListGroup.Item key={restaurant.id} action onClick={() => onRestaurantSelect(restaurant.id)}>
						<h5>{restaurant.name}</h5>
						<p>{restaurant.shortDescription}</p>
						<p>Rating: {restaurant.rating}</p>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Container>
	);
};

export default RestaurantList;
