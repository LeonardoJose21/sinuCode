import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/solid';

export default function Contacto() {
  return (
    <section id="contact" className="flex flex-col p-6 bg-slate-900 text-white text-center h-screen">
      <h2 className="text-3xl font-bold mb-6">Contacto</h2>
      <p className="text-lg mb-6">
        Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros.
      </p>
      <div className="flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0">
        <div className="flex flex-col items-center space-y-2">
        
          <h3 className="text-xl font-semibold">Correo Electrónico</h3>
          <p>
            Puedes enviarnos un correo a: 
            <a href="mailto:leonardopastrana@unisinu.edu.co" className="text-green-600 hover:underline"> leonardopastrana@unisinu.edu.co</a>
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <PhoneIcon className="w-12 h-12 text-green-600 mb-2" />
          <h3 className="text-xl font-semibold">Teléfono</h3>
          <p>
            Llámanos al: 
            <a href="tel:+1234567890" className="text-green-600 hover:underline"> +57 320 589 0089</a>
          </p>
        </div>
      </div>
    </section>
  );
}
