// ProblemContext.js
import React, { createContext, useState, useContext } from 'react';

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
   

    const [writtenProblem, setWrittenProblem] = useState('');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [language, setLanguage] = useState("python");
    const [solution, setSolution] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [stepContent, setStepContent] = useState([]);

    return (
        <ProblemContext.Provider value={{ writtenProblem, setWrittenProblem, selectedProblem,
                                         setSelectedProblem, language, setLanguage,
                                         solution, setSolution, verificationResult, setVerificationResult,
                                         stepContent, setStepContent}}>
            {children}
        </ProblemContext.Provider>
    );
};

export const useProblemContext = () => useContext(ProblemContext);
