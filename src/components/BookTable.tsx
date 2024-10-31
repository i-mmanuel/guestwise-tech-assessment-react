import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

type defaultFormProps = {
	name: string;
	email: string;
	phone: string;
	date: string;
	time: string;
	guests: number;
};
const detaultForm: defaultFormProps = {
	name: "",
	email: "",
	phone: "",
	date: new Date().toISOString().slice(0, 10),
	time: `${new Date().getHours()}:${new Date().getMinutes()}`,
	guests: 1,
};

const BookTable: React.FC = () => {
	const [formData, setFormData] = useState<defaultFormProps>(detaultForm);

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [infoMessage, setInfoMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};
		let infoMsg = null; // Temporary variable for info messages

		// Required field checks
		if (!formData.name) newErrors.name = "Name is required";
		if (!formData.email) newErrors.email = "Email is required";
		if (!formData.phone) newErrors.phone = "Phone is required";

		// Email validation
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (formData.email && !emailPattern.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		// Phone validation
		const phonePattern = /^[0-9]{10}$/;
		if (formData.phone && !phonePattern.test(formData.phone)) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}

		// Date and time validation (1 hour in the future)
		const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
		const now = new Date();
		const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

		if (selectedDateTime <= oneHourFromNow) {
			infoMsg = "Bookings must be at least 1 hour in the future.";
			newErrors.dateTime = "Bookings must be at least 1 hour in the future";
		}

		// Guests validation
		if (formData.guests > 12) {
			infoMsg = "For bookings over 12 guests, please contact us directly via email.";
		} else if (formData.guests < 1) {
			newErrors.guests = "Guests count must be at least 1";
		}

		setErrors(newErrors);
		setInfoMessage(infoMsg);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!validateForm()) return;

		try {
			const response = await fetch("http://localhost:3001/bookings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) throw new Error("Booking failed");
			setSuccessMessage("Booking completed successfully!");
			setInfoMessage(null); // Clear any previous info messages
			setErrors({}); // Clear previous errors

			setFormData({
				name: "",
				email: "",
				phone: "",
				date: new Date().toISOString().slice(0, 10),
				time: `${new Date().getHours()}:${new Date().getMinutes()}`,
				guests: 1,
			});
		} catch (err) {
			console.log(err);
		} finally {
			console.log("Completed request");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData(prevData => ({
			...prevData,
			[name]: name === "guests" ? parseInt(value) : value,
		}));
	};

	return (
		<Container>
			<h2>Book a Table</h2>
			<form onSubmit={handleSubmit}>
				<Form.Group controlId="name">
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						isInvalid={!!errors.name}
					/>
					{errors.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
				</Form.Group>

				<Form.Group controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						isInvalid={!!errors.email}
					/>
					{errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
				</Form.Group>

				<Form.Group controlId="phone">
					<Form.Label>Phone</Form.Label>
					<Form.Control
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleInputChange}
						isInvalid={!!errors.phone}
					/>
					{errors.phone && <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>}
				</Form.Group>

				<Form.Group controlId="date">
					<Form.Label>Date</Form.Label>
					<Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} />
				</Form.Group>

				<Form.Group controlId="time">
					<Form.Label>Time</Form.Label>
					<Form.Control type="time" name="time" value={formData.time} onChange={handleInputChange} />
					{errors.dateTime && <Form.Control.Feedback type="invalid">{errors.dateTime}</Form.Control.Feedback>}
				</Form.Group>

				<Form.Group controlId="guests">
					<Form.Label>Guests</Form.Label>
					<Form.Control type="number" name="guests" value={formData.guests} onChange={handleInputChange} min="1" />
					{errors.guests && <Form.Control.Feedback type="invalid">{errors.guests}</Form.Control.Feedback>}
				</Form.Group>

				{infoMessage && <Alert variant="info">{infoMessage}</Alert>}

				<Button className="mt-4" type="submit">
					Book
				</Button>
			</form>
		</Container>
	);
};

export default BookTable;
