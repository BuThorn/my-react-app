const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchGreeting() {
	const token = localStorage.getItem('token');
	const response = await fetch(`${API_URL}/api/greeting`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Unable to load greeting');
	}

	return data.greeting;
}
