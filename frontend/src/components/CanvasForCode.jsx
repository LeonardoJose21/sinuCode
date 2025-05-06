import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { useProblemContext } from '../ProblemContext';
import { Loader } from 'lucide-react';


const Solution = ({ provided, snapshot, solution_, setSolution, verifySolution }) => {
    const { language, selectedProblem, writtenProblem, solution} = useProblemContext();
    const [loading, setLoading] = useState(false); 

    const handleEditorChange = (value, viewUpdate) => {
        setSolution(value);
    };

    const handleVerifySolution = () => {
        if ( selectedProblem == null && writtenProblem == ''){
            alert("Para verificar debes escoger o redactar un problema");
            return;
        }
        if (solution === '') {
            alert("No puedes verificar una solución vacía");
            return;
        }
        verifySolution(setLoading);
    };

    return (
        <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
                background: snapshot.isDraggingOver ? '#b3e0ff' : '#e0e0e0',
                padding: 8,
                width: '100%',
                minHeight: 200
            }}
            className="md:w-3/5 p-4 mt-4 md:mt-0"
        >
            <div className='flex justify-between'>
                <h2 className="text-xl font-semibold mb-4">Solución en {language}</h2>
                <Button onClick={handleVerifySolution} disabled={loading}>
                    {loading ? <Loader className="animate-spin" /> : 'Verificar'}
                </Button>
            </div>

            <CodeMirror
                value={solution_}
                height="200px"
                theme={oneDark}
                extensions={[javascript(), EditorView.lineWrapping]}
                onChange={handleEditorChange}
                options={{
                    lineNumbers: true,
                }}
            />
            {provided.placeholder}
        </div>
    );
};

export default Solution;
