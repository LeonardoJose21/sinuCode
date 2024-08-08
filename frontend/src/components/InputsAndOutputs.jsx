import React, { useState } from 'react';
import GetHints from './GetHints';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from 'lucide-react';
import { getChatGptResponse } from '../services/chatgptService';
import { useProblemContext } from '../ProblemContext';


const InputOutputComponent = () => {
    const { writtenProblem, selectedProblem } = useProblemContext();
    const [inputs, setInputs] = useState(["..."]);
    const [outputs, setOutputs] = useState(["..."]);
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoadingInput, setIsLoadingInput] = useState(false);
    const [isLoadingOutput, setIsLoadingOutput] = useState(false);
    const [inputHintUsed, setInputHintUsed] = useState(false);
    const [outputHintUsed, setOutputHintUsed] = useState(false);

    const addInput = () => {
        if (inputText === '') {
            alert('Ingrese un dato válido');
        } else if (inputs[0] === "..." || inputs[0] === "") {
            setInputs([inputText]);
        } else {
            setInputs([...inputs, inputText]);
        }
        setInputText('');
    };

    const addOutput = () => {
        if (outputText === '') {
            alert('Ingrese un dato válido');
        } else if (outputs[0] === "..." || outputs[0] === "") {
            setOutputs([outputText]);
        } else {
            setOutputs([...outputs, outputText]);
        }
        setOutputText('');
    };

    const parseResponse = (response) => {
        // Split by commas or newlines, trim each item, and remove quotes/brackets
        const items = response.choices[0].message.content
            .split(/,|\n/)
            .map(item => item.trim().replace(/['"\[\]]+/g, ''))
            .filter(item => item.length > 0); // Filter out empty strings
        return items;
    };
    

    const handleGenerateHintInputs = async () => {
        let delected_or_written;
        if (selectedProblem) {
            delected_or_written = JSON.stringify(selectedProblem)
        }
        else if (writtenProblem) {
            delected_or_written = writtenProblem
        }
        else {
            alert("Escoja o seleccione un problema");
            return;
        }
        const prompt = `I want to code a program that solves this specific problem: ${delected_or_written}. Right now, I need to define all the input values the program or algorithm would need. For example, if I needed to find the GPA of a student, I would need to define a variable for each grade, and a variable for the final GPA. Give me the list of all the input variables the program would need (e.g., 'You need a variable for the grade number 1', 'you needa variable for the sex of the student', etc.). If, there's not a single variable needed. Just tell the user he doesn't need any variable. YOUR ANSWER MUST JUST BE A LIST IN THIS FORMAT: 'input 1, input 2, input 3', and MUST BE IN SPANISH`;
        setIsLoadingInput(true);
        try {
            const response = await getChatGptResponse(prompt);
            const hintArray = parseResponse(response);
            setInputs(hintArray);
            setInputHintUsed(true);
        } catch (error) {
            console.error('Error generating hint:', error);
        } finally {
            setIsLoadingInput(false);
        }

    };

    const handleGenerateHintOutputs = async () => {
        let delected_or_written;
        if (selectedProblem) {
            delected_or_written = JSON.stringify(selectedProblem)
        }
        else if (writtenProblem) {
            delected_or_written = writtenProblem
        }
        else {
            alert("Escoja o seleccione un problema");
            return;
        }

        const prompt = `I want to code a program that solves this specific problem: ${delected_or_written}. Right now, I need to define all the output values or variables the program or algorithm would need to print, show or return. For example, if I needed to find the GPA of a student, I would need to show or print the final average. Give me the list of all the outputs variables the program would need (e.g., 'You need to print the if the user is underage', 'you need to return the final average', etc.). YOUR ANSWER MUST JUST BE A LIST IN THIS FORMAT: 'variable 1, variable 2, variable 3', and MUST BE IN SPANISH`;

        setIsLoadingOutput(true);
        try {
            const response = await getChatGptResponse(prompt);
            const hintArray = parseResponse(response);
            setOutputs(hintArray);
            setOutputHintUsed(true);
        } catch (error) {
            console.error('Error generating hint:', error);
        } finally {
            setIsLoadingOutput(false);
        }

    };

    return (
        <div className="flex flex-col md:flex-row w-full mt-5 space-y-4 md:space-y-0 px-1">
            {/* Left Side - Inputs */}
            <div className="w-full md:w-1/2 p-4 border rounded bg-slate-900 text-white">
                <div className='flex justify-between'>
                    <h3 className="text-lg font-medium mb-2">Datos de entrada (opcional)</h3>
                    <GetHints onGenerateHint={handleGenerateHintInputs} disabled={inputHintUsed} loading={isLoadingInput} />
                </div>

                <ul className="list-disc pl-5 mb-4">
                    {inputs.map((input, index) => (
                        <li key={index}>{input}</li>
                    ))}
                </ul>
                <div className="flex flex-row space-x-2">
                    <Input
                        className="w-full p-1 mb-4 border rounded"
                        placeholder="Ingrese un dato o valor de entrada"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <Button onClick={addInput} className='w-12 p-1'>
                        <SendHorizonalIcon />
                    </Button>
                </div>
            </div>

            {/* Right Side - Outputs */}
            <div className="w-full md:w-1/2 p-4 border rounded bg-slate-900 text-white">
                <div className='flex justify-between'>
                    <h3 className="text-lg font-medium mb-2">Datos de salida</h3>
                    <GetHints onGenerateHint={handleGenerateHintOutputs} disabled={outputHintUsed} loading={isLoadingOutput} />
                </div>

                <ul className="list-disc pl-5 mb-4">
                    {outputs.map((output, index) => (
                        <li key={index}>{output}</li>
                    ))}
                </ul>
                <div className="flex flex-row space-x-2">
                    <Input
                        className="w-full p-1 mb-4 border rounded"
                        placeholder="Dato o proceso que debe arrojar el programa"
                        value={outputText}
                        onChange={(e) => setOutputText(e.target.value)}
                    />
                    <Button onClick={addOutput} className='w-12 p-1'>
                        <SendHorizonalIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InputOutputComponent;
