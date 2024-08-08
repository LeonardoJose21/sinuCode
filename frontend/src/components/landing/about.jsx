import React from 'react';
import { AcademicCapIcon, LightBulbIcon, BriefcaseIcon } from '@heroicons/react/24/solid';

export default function AcercaDe() {
  return (
    <section id="about" className="flex flex-col p-6 bg-white text-slate-900 text-center h-screen items-center">
      <div className='flex flex-row space-x-2'>
        <h2 className="text-3xl font-bold mb-6">Acerca de SinúCode</h2>
        <LightBulbIcon className="w-12 h-12 text-green-600" />
      </div>

      <div className="flex flex-col space-y-2 items-center">
        <p className="text-lg mb-6 md:w-4/5 text-center">
          SinúCode es una plataforma educativa diseñada para los estudiantes de ingeniería de la Universidad del Sinú.
          Con la ayuda de inteligencia artificial, los estudiantes pueden mejorar sus habilidades de programación y
          practicar con problemas reales
        </p>
        <AcademicCapIcon className="w-12 h-12 text-green-600 mb-2" />
      </div>


    </section>
  );
}
