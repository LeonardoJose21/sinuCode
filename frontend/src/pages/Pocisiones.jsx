import React, { useEffect, useState } from 'react';

export default function Posiciones() {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = `${import.meta.env.VITE_API_URL}playground/get_all_users`;

    // Fetch data from the backend
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setPositions(data))
      .catch(error => setError(error.message));
  }, []);

  return (
    <div>
      <h1>Posiciones</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {positions.map((position, index) => (
            <li key={index}>
              {index + 1}. {position.nombre} - {position.puntos} puntos
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
