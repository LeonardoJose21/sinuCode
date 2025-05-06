import React from 'react';
import Steps from '../components/Steps';
import Problem from '../components/Problem';
import FeedbackSection from '../components/FeedbackSection';
import ChatbotBubble from '../components/Chatbot';
import CodeVisualization from '../components/codeViz';

export default function Home() {

  return (
    <div className="flex flex-col text-slate-900">
      <div className="flex flex-1 flex-col">
        <div className="p-5 border-b md:border-b-0 md:border-r border-gray-300 flex-1">
          <h2 className="text-xl font-semibold mb-4">Problemas</h2>
          <Problem />
          <h3 className="text-lg font-medium mb-2 mt-10">Resolución del problema</h3>
          <Steps />
          <CodeVisualization />
          <FeedbackSection />
          <footer className="p-6 bg-slate-900 text-white text-center">
            <p>&copy; 2025 SinúCode. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotBubble />
      </div>
    </div>
  );
}
