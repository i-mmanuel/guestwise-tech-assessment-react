import React, { useEffect, useState } from "react";
import { Card, Container, Spinner, Alert } from "react-bootstrap";
import { getRestaurantDetails } from "../services/api";
import { RestaurantDetailData } from "./RestaurantList";

type RestaurantDetailsProps = {
	restaurantId: number;
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurantId }) => {
	const [details, setDetails] = useState<RestaurantDetailData>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRestaurantDetails = async (restaurantId: number) => {
		try {
			const returnedRestaurantDetails = await getRestaurantDetails(restaurantId);

			if (returnedRestaurantDetails) {
				setDetails(returnedRestaurantDetails.details);
				setError(null);
			} else {
				setError("Error: Restaurant details not found.");
			}
		} catch (error) {
			console.error("Error fetching restaurant details:", error);
			setError("An error occurred while fetching the restaurant details. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRestaurantDetails(restaurantId);
	}, [restaurantId]);

	if (loading) {
		return (
			<Container>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</Container>
		);
	}

	if (error) {
		return (
			<Container>
				<Alert variant="danger">{error}</Alert>
			</Container>
		);
	}

	return (
		<Container>
			<Card>
				<Card.Body>
					<Card.Title>Restaurant Details</Card.Title>
					<Card.Text>Address: {details?.address ?? "N/A"}</Card.Text>
					<Card.Text>Review Score: {details?.reviewScore ?? "N/A"}</Card.Text>
					<Card.Text>Contact: {details?.contactEmail ?? "N/A"}</Card.Text>
					<Card.Text>Opening Hours (Weekday): {details?.openingHours?.weekday ?? "N/A"}</Card.Text>
					<Card.Text>Opening Hours (Weekend): {details?.openingHours?.weekend ?? "N/A"}</Card.Text>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default RestaurantDetails;
