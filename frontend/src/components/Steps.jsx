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
    const { writtenProblem, selectedProblem, language } = useProblemContext();
    const [steps, setSteps] = useState(getItems(0));
    const [solution, setSolution] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isLoadingHint, setIsLoadingHint] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [verificationResult, setVerificationResult] = useState('');
    const [feedback, setFeedback] = useState('');


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
            const response = await axios.post(import.meta.env.VITE_API_URL+'/playground/api/verify-solution/', {
                script: solution,
                language: language
            });
            
            setVerificationResult(response.data.output);
            
        } catch (error) {
            console.error('Error verifying solution:', error);
            setVerificationResult('Error verifying solution.');
        } finally {
            setLoading(false);
            const prompt = "Analyze this code: '"+ solution +"' and its corresponding solution: '"+verificationResult+"'. And provide feedback. " +
               "If the code is correct, just say it to the student, and highlight the corrects parts of the code and explain why they are correct. " +
               "If the code is not correct, identify all the issues or areas for improvement, and explain why these aspects are incorrect. " +
               "'. YOUR ANSWER MUST BE IN SPANISH. Try to give the answer in a single paragraph and keep in mind that this is for a completely beginner programmer.";

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
                
                <div className='flex flex-col md:flex-row bg-gray-300 p-2 h-52 text-start'>
                        <div className='w-1/2 bg-slate-900 text-gray-100 p-2 overflow-y-scroll'>
                        <h1 className='text-xl font-semibold text-green-600 mb-2'>Resultado:</h1>
                        <p>{verificationResult}</p>
                        </div>
                        <div className='w-1/2 bg-slate-900 text-gray-100 p-2 overflow-y-scroll'>
                        <h1 className='text-xl font-semibold text-green-600 mb-2'>Observaciones:</h1>
                            <p>{feedback}</p>
                        </div>
                        
                </div>
            </div>
        </div>
    );
}
