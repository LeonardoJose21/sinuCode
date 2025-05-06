import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

export default function SurveyPage() {
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "playground/api/encuesta/preguntas/")
      .then((response) => response.json())
      .then((data) => {
        // Parse JSON options (stringified array) to real arrays
        const parsed = data.map((q) => ({
          ...q,
          opciones: q.opciones ? JSON.parse(q.opciones) : [],
        }));
        setQuestions(parsed);
        console.log("Preguntas obtenidas:", parsed);
      })
      .catch((error) => {
        console.error("Error al obtener preguntas:", error);
      });
  }, []);

  if (!questions.length) {
    return <div className="text-center p-6">Cargando preguntas...</div>;
  }

  const question = questions[current];

  const handleChange = (value) => {
    setResponses({ ...responses, [question.id]: value });
  };

  const handleCheckboxChange = (option) => {
    const selected = responses[question.id] || [];
    if (selected.includes(option)) {
      setResponses({
        ...responses,
        [question.id]: selected.filter((item) => item !== option),
      });
    } else {
      setResponses({
        ...responses,
        [question.id]: [...selected, option],
      });
    }
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const back = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    console.log("Respuestas a enviar:", responses);

    fetch(import.meta.env.VITE_API_URL + "playground/api/encuesta/respuestas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem(ACCESS_TOKEN),
      },
      body: JSON.stringify(responses),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el envío");
        return res.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        alert("¡Encuesta enviada con éxito!");
        navigate("/"); // Redirigir a la página principal
      })
      .catch((error) => {
        console.error("Error al enviar la encuesta:", error);
        alert("Error al enviar la encuesta");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-xl font-semibold">{question.pregunta}</Label>

            {question.tipo === "opcion_multiple" && (
              <RadioGroup
                className="mt-4 space-y-2"
                value={responses[question.id] || ""}
                onValueChange={(val) => handleChange(val)}
              >
                {question.opciones.map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={opt} />
                    <Label htmlFor={opt}>{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.tipo === "checkbox" && (
              <div className="mt-4 space-y-2">
                {question.opciones.map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <Checkbox
                      id={opt}
                      checked={(responses[question.id] || []).includes(opt)}
                      onCheckedChange={() => handleCheckboxChange(opt)}
                    />
                    <Label htmlFor={opt}>{opt}</Label>
                  </div>
                ))}
              </div>
            )}

            {question.tipo === "texto_abierto" && (
              <Textarea
                className="mt-4"
                value={responses[question.id] || ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
              />
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={back} disabled={current === 0}>
              Anterior
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={next}>Siguiente</Button>
            ) : (
              <Button onClick={handleSubmit}>Enviar</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
