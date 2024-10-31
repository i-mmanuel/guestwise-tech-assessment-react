import React, { useEffect, useState } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { getRestaurantDetails } from "../services/api";
import { RestaurantDetailData } from "./RestaurantList";

type RestaurantDetailsProps = {
	restaurantId: number;
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurantId }) => {
	const [details, setDetails] = useState<RestaurantDetailData>();
	const [loading, setLoading] = useState<boolean>(true);

	const fetchRestaurantDetails = async (restaurantId: number) => {
		try {
			const returnedRestaurantDetails = await getRestaurantDetails(restaurantId);

			if (returnedRestaurantDetails) {
				setDetails(returnedRestaurantDetails.details);
			} else {
				console.log("Error: Restaurant details not found.");
			}
		} catch (error) {
			console.error("Error fetching restaurant details:", error);
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
