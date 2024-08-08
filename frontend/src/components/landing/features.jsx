import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

export default function Caracteristicas() {
  return (
    <section id="features" className="flex flex-col p-10 items-center justify-center bg-slate-900 text-white text-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
      <ul className="list-none space-y-4 md:w-1/2 rounded p-3 text-left">
        <li className="flex items-center space-x-2 animate-fade-in-out" style={{ animationDelay: '0s' }}>
          <CheckIcon className="w-6 h-6 text-green-400" />
          <span>Resolución de problemas de programación asistida por IA.</span>
        </li>
        <li className="flex items-center space-x-2 animate-fade-in-out" style={{ animationDelay: '0.2s' }}>
          <CheckIcon className="w-6 h-6 text-green-400" />
          <span>Evaluación automática de soluciones.</span>
        </li>
        <li className="flex items-center space-x-2 animate-fade-in-out" style={{ animationDelay: '0.4s' }}>
          <CheckIcon className="w-6 h-6 text-green-400" />
          <span>Acceso a una amplia gama de problemas de diferentes niveles de dificultad.</span>
        </li>
        <li className="flex items-center space-x-2 animate-fade-in-out" style={{ animationDelay: '0.6s' }}>
          <CheckIcon className="w-6 h-6 text-green-400" />
          <span>Interfaz intuitiva y fácil de usar.</span>
        </li>
        <li className="flex items-center space-x-2 animate-fade-in-out" style={{ animationDelay: '0.8s' }}>
          <CheckIcon className="w-6 h-6 text-green-400" />
          <span>Seguimiento del progreso individual.</span>
        </li>
      </ul>
    </section>
  );
}
