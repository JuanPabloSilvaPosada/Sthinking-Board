import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";

const Column = ({ title, columnDate }) => {
  // Formatear la fecha para mostrar solo día, mes y año
  const formattedDate = new Date(columnDate).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div className="column-card p-4 bg-white rounded-lg shadow w-full max-w-64 min-w-64 h-min">
      <div className="flex items-center justify-between gap-4">
        <span className="column-title font-bold text-md">{title}</span>
        <button
          className="flex items-center justify-center rounded-md hover:bg-neutral-200 w-7"
          onClick={() => {console.log("Column Actions")}}
        >
          <BsThreeDots />
        </button>
      </div>
      <div className="overflow-y-scroll">{/* Aca ira el contenido de las tareas */}</div>
      <div className="text-end flex flex-col gap-2 mt-4">
        <button
          className="w-full py-1 px-2 flex items-center justify-start gap-1 hover:text-neutral-600"
          onClick={() => {console.log("Añadir tarea")}}
        >
          <AiOutlinePlus className="text-inherit" />
          Añadir tarea
        </button>
        <p className="text-xs text-neutral-600 font-light">
          Fecha de creación: {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default Column;
