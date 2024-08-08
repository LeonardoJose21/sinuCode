import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'; // Import Check icon
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        color: "#1a202c", // slate-900 color
      }}
      onClick={onClick}
    >
      <ArrowRight size={24} className='my-auto' />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        color: "#1a202c", // slate-50 color
      }}
      onClick={onClick}
    >
      <ArrowLeft size={24} className='my-auto' />
    </div>
  );
}

export let SelectedProblem = null;

const Slideshow = ({ codingProblems, selectedProblem, onSelectProblem }) => {

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  const selectBtn = (p) => {
    onSelectProblem(p);
    SelectedProblem = p;
    console.log(codingProblems);
  }

  return (
    <div className="px-4 md:px-7 w-5/6 mx-auto overflow-hidden">
      <Slider {...settings} className="px-1">
        {codingProblems.length > 0 ? (
          codingProblems.map((problem) => (
            <div key={problem.id_problema} className="p-5 border border-slate-300 rounded bg-slate-900 text-white">
              <div className='flex flex-grow gap-3'>
              <div>
                <span className="font-semibold">Dificultad:</span> {problem.dificultad}
              </div>
              <div>
                <span className="font-semibold">Lenguaje:</span> {problem.lenguaje}
              </div>
              <div>
                <span className="font-semibold">Tema:</span> {problem.tema}
              </div>
              </div>
              <p className="text-base mt-2 border border-slate-600 text-center p-2 mb-3">{problem.problema}</p>
              <div>
                <Button
                  onClick={() => selectBtn(problem)}
                  className="mt-2 mb-2"
                >
                  {selectedProblem && selectedProblem.id_problema === problem.id_problema ? (
                    <>
                      Selected
                      <Check size={16} className="ml-2" />
                    </>
                  ) : (
                    'Select'
                  )}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay ningún problema disponible</p>
        )}
      </Slider>
    </div>
  );
};

export default Slideshow;
