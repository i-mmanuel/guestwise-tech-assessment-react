import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RestaurantDetails from "../components/RestaurantDetails";
import { getRestaurantDetails } from "../services/api";

// Mock the entire module
jest.mock("../services/api", () => ({
	getRestaurantDetails: jest.fn(),
}));

describe("RestaurantDetails Component", () => {
	let restaurantDetailsData: any;

	beforeEach(() => {
		restaurantDetailsData = {
			address: "123 Main St",
			openingHours: {
				weekday: "9 AM - 5 PM",
				weekend: "10 AM - 6 PM",
			},
			reviewScore: 4.5,
			contactEmail: "contact@restaurant.com",
		};
	});

	it("displays a loading spinner initially", () => {
		(getRestaurantDetails as jest.Mock).mockResolvedValueOnce({ details: restaurantDetailsData });
		render(<RestaurantDetails restaurantId={1} />);

		const spinner = screen.getByRole("status");
		expect(spinner).toBeInTheDocument();
	});

	it("renders restaurant details after data fetch", async () => {
		(getRestaurantDetails as jest.Mock).mockResolvedValueOnce({ details: restaurantDetailsData });
		render(<RestaurantDetails restaurantId={1} />);

		await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
		expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
		expect(screen.getByText(/9 AM - 5 PM/)).toBeInTheDocument();
		expect(screen.getByText(/10 AM - 6 PM/)).toBeInTheDocument();
		expect(screen.getByText(/4.5/)).toBeInTheDocument();
		expect(screen.getByText(/contact@restaurant.com/)).toBeInTheDocument();
	});

	it("handles API errors gracefully", async () => {
		(getRestaurantDetails as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
		render(<RestaurantDetails restaurantId={1} />);

		await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
		expect(screen.queryByText(/Address:/)).toBeNull();
		expect(console.error).toHaveBeenCalledWith("Error fetching restaurant details:", expect.any(Error));
	});

	it('displays "N/A" if data is missing', async () => {
		(getRestaurantDetails as jest.Mock).mockResolvedValueOnce({ details: null });
		render(<RestaurantDetails restaurantId={1} />);

		await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
		expect(screen.getByText(/Address: N\/A/)).toBeInTheDocument();
		expect(screen.getByText(/Review Score: N\/A/)).toBeInTheDocument();
		expect(screen.getByText(/Contact: N\/A/)).toBeInTheDocument();
		expect(screen.getByText(/Opening Hours \(Weekday\): N\/A/)).toBeInTheDocument();
		expect(screen.getByText(/Opening Hours \(Weekend\): N\/A/)).toBeInTheDocument();
	});

	it("fetches new data when restaurantId prop changes", async () => {
		(getRestaurantDetails as jest.Mock).mockResolvedValueOnce({ details: restaurantDetailsData });
		const { rerender } = render(<RestaurantDetails restaurantId={1} />);

		await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
		expect(screen.getByText(/123 Main St/)).toBeInTheDocument();

		const newDetailsData = {
			address: "456 Another St",
			openingHours: {
				weekday: "8 AM - 4 PM",
				weekend: "Closed",
			},
			reviewScore: 4.8,
			contactEmail: "contact@newrestaurant.com",
		};
		(getRestaurantDetails as jest.Mock).mockResolvedValueOnce({ details: newDetailsData });

		rerender(<RestaurantDetails restaurantId={2} />);
		await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
		expect(screen.getByText(/456 Another St/)).toBeInTheDocument();
		expect(screen.getByText(/8 AM - 4 PM/)).toBeInTheDocument();
		expect(screen.getByText(/Closed/)).toBeInTheDocument();
		expect(screen.getByText(/4.8/)).toBeInTheDocument();
		expect(screen.getByText(/contact@newrestaurant.com/)).toBeInTheDocument();
	});
});
