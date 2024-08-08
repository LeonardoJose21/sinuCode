// ProblemContext.js
import React, { createContext, useState, useContext } from 'react';

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
    const [writtenProblem, setWrittenProblem] = useState('');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [language, setLanguage] = useState("python");

    return (
        <ProblemContext.Provider value={{ writtenProblem, setWrittenProblem, selectedProblem, setSelectedProblem, language, setLanguage }}>
            {children}
        </ProblemContext.Provider>
    );
};

export const useProblemContext = () => useContext(ProblemContext);
