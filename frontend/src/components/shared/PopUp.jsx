import React, { useEffect, useRef } from 'react';

const PopUp = ({ isOpen, onClose, onSubmit, title, children }) => {
  const popUpRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        ref={popUpRef}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          {children} {/* Renderiza el contenido específico del PopUp */}
          <div className="flex between w-full">
            <button type="button" onClick={onClose} className="w-full mr-2 bg-slate-200 hover:bg-slate-300 p-2 rounded">Cancelar</button>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-700 text-white p-2 rounded">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;