

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Posiciones() {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "playground/api/get_all_users/")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching positions");
        return res.json();
      })
      .then((data) => setPositions(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Ranking de Estudiantes</h1>

      {error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <div className="space-y-4">
          {positions.map((user, index) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">
                    #{index + 1} - {user.nombre_completo}
                  </p>
                </div>
                <Badge>{user.puntos} puntos</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
