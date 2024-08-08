import React from 'react';
import Steps from '../components/Steps';
import InputOutputComponent from '../components/InputsAndOutputs';
import Problem from '../components/Problem';

export default function Home() {

  return (
    <div className="flex flex-col text-slate-900">
      <div className="flex flex-1 flex-col">
        <div className="p-5 border-b md:border-b-0 md:border-r border-gray-300 flex-1">
          <h2 className="text-xl font-semibold mb-4">Problema</h2>
          <Problem />
          <h3 className="text-lg font-medium mb-1 mt-8">1) ¿Cuáles son los datos de entrada y salida del programa o algoritmo?</h3>
          <p className='px-2 text-base'> Escriba, uno por uno, los datos de entrada (si son necesarios) y de salida del programa. Si está confundido o no sabe por donde empezar puede pedir pistas.</p>
          <InputOutputComponent  />
          <h3 className="text-lg font-medium mb-2">2) Pasos para resolver el problema</h3>
          <Steps />
        </div>
      </div>
    </div>
  );
}
