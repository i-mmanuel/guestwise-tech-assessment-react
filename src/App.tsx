import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetails from "./components/RestaurantDetails";
import BookTable from "./components/BookTable";

function App() {
	const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

	return (
		<Container className="mt-5">
			<Row>
				<Col md={4}>
					<RestaurantList onRestaurantSelect={setSelectedRestaurantId} />
				</Col>
				<Col md={8}>
					{selectedRestaurantId && (
						<>
							<RestaurantDetails restaurantId={selectedRestaurantId} />
							<BookTable />
						</>
					)}
				</Col>
			</Row>
		</Container>
	);
}

export default App;
