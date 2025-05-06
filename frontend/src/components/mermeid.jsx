import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

const MermaidRenderer = ({ chart }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (chart && containerRef.current) {
      mermaid.initialize({ startOnLoad: true, theme: 'default' });
      mermaid.render('theGraph', chart, (svgCode) => {
        containerRef.current.innerHTML = svgCode;
      });
    }
  }, [chart]);

  return <div ref={containerRef} />;
};

export default MermaidRenderer;