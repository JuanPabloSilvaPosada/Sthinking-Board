import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const Task = ({ taskTitle, taskId, onDelete, onClick }) => {
  return (
    <div
      className="flex justify-between items-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 cursor-pointer"
      onClick={onClick}
    >
      <span>{taskTitle}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evitar que el clic se propague al componente padre
          onDelete(taskId);
        }}
        className="text-red-500 hover:text-red-700"
      >
        <AiOutlineDelete size={20} />
      </button>
    </div>
  );
};

export default Task;