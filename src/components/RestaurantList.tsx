import React, { useEffect, useState } from "react";
import { ListGroup, Container, Spinner, Alert } from "react-bootstrap";
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

	return (
		<Container>
			<h2>Restaurants</h2>

			{loading && (
				<div className="text-center">
					<Spinner animation="border" />
				</div>
			)}

			{error && <Alert variant="danger">{error}</Alert>}

			<ListGroup>
				{!loading && !error && restaurants.length === 0 && <ListGroup.Item>No restaurants found.</ListGroup.Item>}
				{restaurants.map(restaurant => (
					<ListGroup.Item key={restaurant.id} action onClick={() => onRestaurantSelect(restaurant.id)}>
						<h5>{restaurant.name}</h5>
						<p>{restaurant.shortDescription}</p>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Container>
	);
};

export default RestaurantList;
