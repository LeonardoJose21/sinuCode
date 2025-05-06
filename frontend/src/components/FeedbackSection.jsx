import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ACCESS_TOKEN } from "../constants";

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchAllFeedback = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "playground/api/all_feedback/"
      );
      const data = await response.json();
      setFeedbackList(data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Por favor, escribe algo antes de enviar.");
      return;
    }

    try {
      setIsSending(true);
      const response = await fetch(
        import.meta.env.VITE_API_URL + "playground/api/feedback/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
          body: JSON.stringify({ comentario: feedback }),
        }
      );

      if (response.ok) {
        alert("¡Comentario enviado con éxito!");
        setFeedback("");
        fetchAllFeedback(); // refresh after sending
      } else {
        alert("Hubo un problema al enviar tu comentario.");
      }
    } catch (error) {
      alert("Error de red. Intenta nuevamente.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mx-5">
      {/* Input Section */}
      <div>
        <Label htmlFor="feedback" className="text-lg font-semibold">
          ¿Tienes sugerencias o comentarios?
        </Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe tus comentarios aquí..."
          className="mt-2 mb-4"
          rows={4}
        />
        <Button onClick={handleSubmit} disabled={isSending || !feedback}>
          {isSending ? "Enviando..." : "Enviar Comentario"}
        </Button>
      </div>

      {/* Feedback List Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Comentarios previos de los alumnos</h2>
        <div className="border rounded p-4 max-h-[300px] overflow-y-scroll space-y-4">
          {feedbackList.length === 0 ? (
            <p className="text-muted-foreground">Aún no hay comentarios.</p>
          ) : (
            feedbackList.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <p className="font-medium">{item.estudiante_nombre}</p>
                <p className="text-sm text-gray-600">{item.comentario}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.fecha).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
