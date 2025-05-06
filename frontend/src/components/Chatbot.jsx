import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { getChatGptResponse } from "../services/chatgptService";
import { useProblemContext } from "../ProblemContext";

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { writtenProblem, selectedProblem, language, stepContent,
    solution, verificationResult} = useProblemContext();
  const [messages, setMessages] = useState([
    { text: "Hola, ¿en qué puedo ayudarte hoy?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const definePrompt = (input) => {
  
    let problemPart = "";
    let stepsPart = "";
    let solutionPart = "";
  
    // Determine problem description
    if (selectedProblem) {
      problemPart = `El estudiante está intentando resolver el siguiente problema de programación en ${language}: ${JSON.stringify(selectedProblem)}.`;
    } else if (writtenProblem) {
      problemPart = `El estudiante escribió el siguiente problema de programación en ${language}: ${writtenProblem}.`;
    }
  
    // Add steps, if any
    if (stepContent && stepContent.length > 0) {
      const formattedSteps = stepContent.map((s, i) => `${i + 1}. ${s}`).join(" ");
      stepsPart = ` Estos son los pasos que planea seguir: ${formattedSteps}.`;
    }
  
    // Add code and expected output
    if (solution) {
      solutionPart = ` Este es el código que ha escrito: ${solution}.`;
    }
  
    if (verificationResult) {
      solutionPart += ` Y esta es la salida esperada o verificación: ${verificationResult}.`;
    }
  
    // Final prompt
    const prompt = `Eres un asistente experto en programación. Tu tarea es ayudar a un estudiante principiante a entender y mejorar su enfoque de programación. ${problemPart}${stepsPart}${solutionPart} Proporciónale orientación clara, sencilla y útil en español. Aclara todas sus dudas Usa un lenguaje amigable y evita tecnicismos innecesarios.
    En esta ocasión, la duda del estudiante es: ${input}`;
  
    return prompt.trim();
  };
  

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
    
     const prompt = definePrompt(input);

      const response = await getChatGptResponse(prompt);
      const feedback = response.choices[0].message.content;
    // console.log("Prompt:", prompt);

      setMessages((prev) => [...prev, { text: feedback, sender: "bot" }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Hubo un error al procesar la solicitud. Intenta de nuevo."+err, sender: "bot" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-700 transition"
        >
          💬
        </button>
      )}

      {/* Chat Bubble */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-700 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">Asistente SinúCode</span>
            <button onClick={() => setIsOpen(false)} className="text-lg">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === "bot"
                    ? "bg-gray-200 ml-0"
                    : "bg-slate-800 text-white mr-0 ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-3 py-1 border rounded-md text-sm"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-green-600 text-white px-3 rounded-md hover:bg-green-700 text-sm"
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
