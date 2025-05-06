import Slideshow from '@/components/Slideshow';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useProblemContext } from '../ProblemContext';
import { useEffect, useState } from 'react';

export default function Problem() {
    const { writtenProblem, setWrittenProblem, selectedProblem, setSelectedProblem, language, setLanguage } = useProblemContext();
    const [problemType, setProblemType] = useState('write');
    const [difficulty, setDifficulty] = useState('facil');
    const [topic, setTopic] = useState('');
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [codingProblems, setCodingProblems] = useState([]);

    const handleInputChange = (event) => {
        setWrittenProblem(event.target.value);
        console.log(event.target.value);
    };

    useEffect(() => {

        fetch(import.meta.env.VITE_API_URL + '/playground/get_problems/')
            .then(response => response.json())
            .then(data => setCodingProblems(data));
        // Filter problems based on selected difficulty and topic
        const filtered = codingProblems.filter(problem => {
            return (difficulty ? problem.dificultad === difficulty : true) &&
                (topic ? problem.tema === topic : true) &&
                (language ? problem.lenguaje === language : true);
        });
        setFilteredProblems(filtered);
        // console.log(filtered.length);
    }, [problemType, difficulty, topic, language]);

    const onSelectProblem = (value, problems) => {
        setProblemType(value);
        setSelectedProblem(null); // Reset selectedProblem when changing problem type
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row space-y-3">
                <div className="flex-1 md:w-2/5 px-4">
                    <h3 className='text-base font-semibold mb-5'>
                        Opciones y filtros
                    </h3>
                    <Select onValueChange={(value) => onSelectProblem(value, codingProblems)} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Escoja si desea escribir el problema o escoger uno existente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="write">Escribir Un Problema</SelectItem>
                            <SelectItem value="select">Seleccionar Un Problema</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setLanguage(value)}>
                        <SelectTrigger className="w-full mt-4">
                            <SelectValue placeholder="Escoja el lenguaje de programación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setDifficulty(value)}>
                                <SelectTrigger className="w-full mt-4">
                                    <SelectValue placeholder="Selecciona la dificultad del problema" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="facil">Fácil</SelectItem>
                                    <SelectItem value="medio">Medio</SelectItem>
                                    <SelectItem value="dificil">Dificil</SelectItem>
                                </SelectContent>
                    </Select>

                    {problemType === 'select' ? (
                        <>

                            <Select onValueChange={(value) => setTopic(value)}>
                                <SelectTrigger className="w-full mt-4">
                                    <SelectValue placeholder="Seleccione un tema" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="variables">Variables</SelectItem>
                                    <SelectItem value="operaciones basicas">Operaciones Básicas</SelectItem>
                                    <SelectItem value="ciclos">ciclos</SelectItem>
                                    <SelectItem value="condicionales">Conditionales</SelectItem>
                                    <SelectItem value="Arrays/Vectores">Arrays o Vectores</SelectItem>
                                    <SelectItem value="Matrices">Matrices</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    ) : null}
                </div>
                <div className="md:w-3/5">
                    <div className='flex justify-between ml-5 mr-10'>
                        <h3 className='text-base font-semibold ml-4 px-2'>
                            Descripción del problema
                        </h3>
                        <Button className="bg-slate-600" onClick={() => window.location.reload()} > Nuevo problema </Button>
                    </div>
                    {problemType === 'write' &&(
                        <p className='mx-6 text-sm text-gray-600 mb-5 mt-5'>Nota: Si desea escribir su propia ejercicio es importante que defina el lenguaje y la dificulta del ejercicio. Por defecto se establece python y facil respectivamente como valores predeterminados</p>
                    )}

                    {problemType === 'write' ? (
                        <div className="relative mt-4 mx-5">
                            <textarea
                                className="bg-slate-900 text-white w-full p-2 pr-14 border rounded pl-4"
                                rows="3"
                                placeholder="Escriba el problema"
                                onChange={handleInputChange}
                                value={writtenProblem}
                            />
                        </div>
                    ) : (
                        <div className="mt-4 w-full">
                            <Slideshow
                                codingProblems={filteredProblems}
                                selectedProblem={selectedProblem}
                                onSelectProblem={setSelectedProblem}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
