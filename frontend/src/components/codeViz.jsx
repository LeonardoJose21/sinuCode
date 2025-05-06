import { useState, useEffect, useRef } from 'react';
import { useProblemContext } from '../ProblemContext';
import { getChatGptResponse } from '../services/chatgptService';
import mermaid from 'mermaid'; // Import mermaid if installed via npm

// Initialize Mermaid configuration once (optional, can be done elsewhere)
mermaid.initialize({
  startOnLoad: false, // We will manually trigger rendering
  theme: 'default', // or 'dark', 'forest', etc.
  // Add other configuration options as needed
});


const CodeVisualization = () => {
  const { language, solution } = useProblemContext();
  const [visualizationType, setVisualizationType] = useState('flow'); // 'flow' or 'steps'
  const [visualizationOutput, setVisualizationOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const mermaidContainerRef = useRef(null); // Create a ref for the Mermaid container div

  // Effect to render Mermaid when visualizationOutput changes and is for flow
  useEffect(() => {
    // Check if there is visualization output, if it's for a flow chart,
    // and if the mermaid container element exists in the DOM.
    if (visualizationOutput && visualizationType === 'flow' && mermaidContainerRef.current) {
      try {
        const container = mermaidContainerRef.current;
        const mermaidDefinition = visualizationOutput;

        // Clear previous content
        container.innerHTML = '';

        // Generate a unique ID for the SVG element
        const svgId = `mermaid-svg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Use mermaid.render to generate the SVG and inject it into the container
        mermaid.render(svgId, mermaidDefinition)
          .then(({ svg, bindFunctions }) => {
            container.innerHTML = svg; // Inject the generated SVG

            // If there are interactive elements (like links), bind functions
            if (bindFunctions) {
              bindFunctions(container);
            }
          })
          .catch(error => {
            console.error('Error rendering Mermaid diagram:', error);
            container.innerHTML = `<pre style="color: red;">Error rendering diagram: ${error.message}</pre>`;
          });

      } catch (error) {
        console.error('Unexpected error in Mermaid effect:', error);
        if(mermaidContainerRef.current) {
             mermaidContainerRef.current.innerHTML = `<pre style="color: red;">An unexpected error occurred.</pre>`;
        }
      }
    } else if (visualizationType === 'steps' && mermaidContainerRef.current) {
       // If it's steps, ensure the mermaid container is cleared
       mermaidContainerRef.current.innerHTML = '';
    }
  }, [visualizationOutput, visualizationType]); // Re-run effect when visualizationOutput or visualizationType changes

  const handleVisualize = async () => {
    const prompt =
      visualizationType === 'flow'
        // Adjusted the ending of the first template literal
        ? `Genera un diagrama de flujo para el siguiente código en ${language} usando sintaxis Mermaid. Incluye la sintaxis dentro de un bloque \`\`\`mermaid\`\`\`.`
        : `Explica la ejecución paso a paso del siguiente código en ${language} usando formato de lista con viñetas:\n\n${solution}`;


    setLoading(true);
    setVisualizationOutput(''); // Clear previous output while loading

    // Clear the mermaid container immediately when starting a new visualization
    if(mermaidContainerRef.current) {
        mermaidContainerRef.current.innerHTML = '';
    }

    try {
      const response = await getChatGptResponse(prompt);
      const content = response.choices[0].message.content;

      if (visualizationType === 'flow') {
        // Extract only the content within the ```mermaid``` block
        const mermaidCodeMatch = content.match(/```mermaid\s+([\s\S]+?)```/);
        const mermaidSyntax = mermaidCodeMatch ? mermaidCodeMatch[1].trim() : 'No se pudo extraer la sintaxis Mermaid. La respuesta debe incluir ```mermaid...```';
        setVisualizationOutput(mermaidSyntax);
      } else {
        // For steps, just display the text content
        setVisualizationOutput(content);
      }

    } catch (error) {
      console.error('Error al generar visualización:', error);
      setVisualizationOutput('Hubo un error al generar la visualización.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-4 bg-white p-4 rounded shadow-md'>
      <h6 className='text-lg font-semibold mb-2 text-center'>Visualización del código</h6>
      <p className='text-sm text-gray-600 mb-4 text-center'>Puedes generar una visualización del código a fin de entenderlo mejor. Asegurate de <b> haber redactado tu código</b> en el editor
        de lo contrario no estará habilitada esta opción.
      </p>
      <div className='flex flex-col md:flex-row items-center gap-4 justify-center'>
        <select
          value={visualizationType}
          onChange={(e) => {
            setVisualizationType(e.target.value);
            setVisualizationOutput(''); // Clear output when changing type
            // Clear the mermaid container if changing away from flow
            if (e.target.value !== 'flow' && mermaidContainerRef.current) {
                 mermaidContainerRef.current.innerHTML = '';
            }
          }}
          className='border border-gray-300 rounded p-2'
        >
          <option value='flow'>Diagrama de flujo</option>
          <option value='steps'>Ejecución paso a paso</option>
        </select>

        <button
          onClick={handleVisualize}
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50'
          disabled={loading || solution === ''} // Disable button if loading or no solution
        >
          {loading ? 'Generando...' : 'Generar visualización'}
        </button>
      </div>

      {/* Render output only if there is output or if loading */}
      {(visualizationOutput || loading) && (
        <div className='mt-4  p-4 rounded overflow-y-scroll max-h-60'>
          <h2 className='text-xl font-semibold text-green-400 mb-2'>Visualización generada:</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : visualizationType === 'flow' ? (
            // This div will be targeted by the useEffect for Mermaid rendering
            // The rendered SVG will appear inside this div
            <div className="mermaid-graph" ref={mermaidContainerRef}>
              {/* Initial content can be a loading indicator or empty */}
              Rendering diagram...
            </div>
          ) : (
            // For steps, render as preformatted text
            <pre className='whitespace-pre-wrap'>
              {visualizationOutput}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeVisualization;