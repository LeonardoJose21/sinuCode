import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import GetHints from './GetHints';
import { getChatGptResponse } from '../services/chatgptService';
import Solution from './CanvasForCode';
import { useProblemContext } from '../ProblemContext';
import { ACCESS_TOKEN } from "../constants";
import axios from 'axios';

// Fake data generator
const getItems = count =>
    Array.from({ length: count }, () => ({
        id: uuidv4(),
        content: ''
    }));

// Function to reorder the list
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 8;

// Styles for draggable items
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#d3f4f8' : '#f0f0f0',
    width: '100%',
    boxSizing: 'border-box',
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#b3e0ff' : '#e0e0e0',
    padding: grid,
    width: '100%'
});


export default function Steps() {
    const { writtenProblem, selectedProblem, language, setStepContent,
        solution, setSolution, verificationResult, setVerificationResult } = useProblemContext();
    const [inputValue, setInputValue] = useState('');
    const [isLoadingHint, setIsLoadingHint] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [steps, setSteps] = useState(getItems(0));
    const [feedback, setFeedback] = useState('');
    let problemId = null // Store the problem ID if needed


    let prompt;

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Add a new step
    const addStep = () => {
        if (inputValue.trim() !== '') {
            const newStep = { id: uuidv4(), content: inputValue };
            setSteps([...steps, newStep]);
            setStepContent(prevContent => [...prevContent, inputValue]);
            setInputValue(''); // Clear input field after adding
        }
    };

    // Delete a step
    const deleteStep = index => {
        const newSteps = steps.filter((_, i) => i !== index);
        setSteps(newSteps);
    };

    // Handle drag end
    const onDragEnd = async result => {
        if (!result.destination) {
            return;
        }

        if (result.destination.droppableId === 'solution') {
            let prompt;
            setSolution('Cargando Código. Sea paciente...');
            const draggedStep = steps[result.source.index];
            if (solution.length === 0) {
                prompt = `Convert the following step to ${language} code: ${draggedStep.content}. Comments and variables must be in Spanish. Use simple solutions.`;
            } else {
                prompt = `Convert the following step to ${language} code: ${draggedStep.content}. Comments and variables must be in Spanish. Use simple solutions. The user already has this code: ${solution}. Ensure your answer combines properly with the previous code. In other words, your answer must be the previous code plus the new one. *Provide only the code from the beginning up to the current step without revealing the entire solution unless it's the final step*. Plus, never give the code inside multilines docstrings`;
            }

            const response = await getChatGptResponse(prompt);
            const code = response.choices[0].message.content;


            setSolution(code);

            const newSteps = steps.filter((_, i) => i !== result.source.index);
            setSteps(newSteps);
        } else {
            const items = reorder(steps, result.source.index, result.destination.index);
            setSteps(items);
        }
    };

    const verifySolution = async (setLoading) => {
        setLoading(true);
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/playground/api/verify-solution/', {
                script: solution,
                language: language
            });

            setVerificationResult(response.data.output);

            if (selectedProblem === null) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/playground/api/save-written-problem/`,
                        {

                            problema: writtenProblem,   // assuming problem.problema is the written text
                            lenguaje: language,
                            dificultad: 'facil' // or get this from the UI
                            
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );

                    problemId = response.data.id;
                    console.log("Problema escrito guardado exitosamente:", response.data.id);
                    // now you can use savedProblemId to continue saving the solved problem
                } catch (error) {
                    console.error("Error al guardar el problema escrito:", error);
                }
            } else{
                problemId = selectedProblem.id;
            }


            if (response.data.status === 'success') {
                try {
                    console.log(problemId);
                    await axios.post(`${import.meta.env.VITE_API_URL}/playground/api/save-verified-problem/`, {
                        problema_id: problemId,
                        solucion: solution,
                        retroalimentacion: feedback, // From ChatGPT response
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log("Problema guardado exitosamente.");
                } catch (error) {
                    console.error("Error al guardar el problema:", error.response?.data || error.message);
                }
            }

        } catch (error) {
            console.error('Error verifying solution:', error);
            setVerificationResult('Ha ocurrido un  error. Intente de nuevo.');
        } finally {
            setLoading(false);
            const prompt = `Eres un asistente experto en programación que ayuda a estudiantes principiantes. 
                            Analiza el siguiente código escrito por un estudiante: '${solution}' y compáralo con la solución esperada: '${verificationResult}'. 

                            Proporciona retroalimentación clara y útil en español. 

                            - Si el código es correcto, felicita al estudiante brevemente, explica por qué su lógica es adecuada y menciona qué partes del código están bien estructuradas.
                            - Si hay errores o aspectos por mejorar, identifica los problemas claramente y ofrece sugerencias concretas para corregirlos o mejorar el enfoque.
                            - También puedes proponer una solución alternativa con una lógica diferente si crees que es útil para el aprendizaje.

                            Tu respuesta debe estar escrita como un solo párrafo, usando un lenguaje sencillo y amigable, ideal para alguien que está empezando a aprender a programar.`
            try {
                const response = await getChatGptResponse(prompt);

                setFeedback(response.choices[0].message.content)

            } catch (error) {
                console.error('Error generating hint:', error);
            }
        }
    };


    const definePrompt = () => {
        let delected_or_written;
        if (selectedProblem) {
            delected_or_written = JSON.stringify(selectedProblem)
        }
        else if (writtenProblem) {
            delected_or_written = writtenProblem
        }
        else {
            return;
        }
        prompt = "I want to code a program in " + language + " that solves this specific problem: " + delected_or_written + ". Provide a step-by-step solution to this problem, detailing the steps required. YOUR ANSWER MUST HAVE THIS FORMAT: '[1. step 1], [2. Step], [3. Step 3]', and MUST BE IN SPANISH";
    };

    const parseResponse = (response) => {
        // Extract content inside brackets and split by numerical indicators (e.g., "1. ", "2. ")
        const items = response.choices[0].message.content
            .match(/\[\d+\.\s*[^\]]+\]/g) // Match items like "[1. step 1]"
            .map(item => item.replace(/[\[\]]/g, '').trim()); // Remove only the brackets, trim each item
        return items;
    };


    const handleGenerateHint = async () => {

        definePrompt();
        if (prompt) {
            setIsLoadingHint(true);
            try {
                const response = await getChatGptResponse(prompt);
                const hintArray = parseResponse(response);
                const hintSteps = hintArray.map(item => ({ id: uuidv4(), content: item }));
                setSteps([...steps, ...hintSteps]);
                setHintUsed(true);
            } catch (error) {
                console.error('Error generating hint:', error);
            } finally {
                setIsLoadingHint(false);
            }
        }
        else {
            alert("Escoja o seleccione un problema");
        }

    };

    return (
        <div className="w-full px-4 py-6 border flex flex-col md:flex-row">
            <div className="flex-1 md:w-2/5">
                <div className='flex justify-around mb-4'>
                    <h2 className="text-xl font-semibold mb-4">Pasos</h2>
                    <GetHints onGenerateHint={handleGenerateHint} disabled={hintUsed} loading={isLoadingHint} />
                </div>

                {/* Container for Input, Add Step Button, and GetHints */}
                <div className="flex mb-5 space-x-2 items-center">
                    <Input
                        className="flex-1 p-2 border rounded"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Escriba un paso"
                    />
                    <Button onClick={addStep} className="p-2 rounded">
                        <SendHorizontal />
                    </Button>
                </div>

                {/* Drag and Drop area */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="steps">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                className="flex flex-col space-y-2"
                            >
                                {steps.map((step, index) => (
                                    <Draggable key={step.id} draggableId={step.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                className="flex items-center justify-between p-2"
                                            >
                                                <div className="flex-1">
                                                    {step.content}
                                                </div>
                                                <Button
                                                    onClick={() => deleteStep(index)}
                                                    className="ml-2 p-1 w-8 h-8 bg-red-500 text-white"
                                                >
                                                    <Trash size={20} />
                                                </Button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="solution">
                        {(provided, snapshot) => (
                            <Solution
                                provided={provided}
                                snapshot={snapshot}
                                solution={solution}
                                setSolution={setSolution}
                                verifySolution={verifySolution}
                            />
                        )}
                    </Droppable>
                </DragDropContext>

                <div className='flex flex-col w-full md:flex-row bg-gray-300 p-2 min-h-[300px]'>
                    <div className='md:w-1/2 bg-slate-900 text-gray-100 p-2 overflow-y-scroll'>
                        <h1 className='text-xl font-semibold text-green-600 mb-2 mx-5'>Resultado:</h1>
                        <p className='text-base leading-relaxed mx-5'>{verificationResult}</p>
                    </div>
                    <div className='md:w-1/2 bg-slate-900 text-gray-100 p-2 overflow-y-scroll mt-3'>
                        <h1 className='text-xl font-semibold text-green-600 mb-2 mx-5'>Observaciones:</h1>
                        <p className='text-base leading-relaxed mx-5'>{feedback}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
