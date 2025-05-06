import React, { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const SolvedProblemsPage = () => {
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "playground/api/resueltos/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSolvedProblems(response.data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchSolvedProblems();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Problemas Resueltos</h2>
      {solvedProblems.length === 0 ? (
        <p>No hay problemas resueltos aún.</p>
      ) : (
        <ul className="space-y-4">
          {solvedProblems.map((problem) => (
            <li key={problem.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{problem.problema_nombre}</h3>
              <p className="mt-2"><strong>Retroalimentación:</strong> {problem.retroalimentacion}</p>
              <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                {problem.solucion}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SolvedProblemsPage;
