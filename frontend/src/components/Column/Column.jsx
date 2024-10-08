import React, { useState, useEffect } from "react";
import Task from "../Task/Task";
import OpenTask from "../Task/OpenTask";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineCheck } from "react-icons/ai";

const Column = ({ title, columnDate, id, onDelete, onEdit }) => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [selectedTask, setSelectedTask] = useState(null); // Tarea seleccionada para edición
  const [isAddingTask, setIsAddingTask] = useState(false); // Estado para mostrar el input de añadir tarea
  const [newTaskTitle, setNewTaskTitle] = useState(""); // Estado para almacenar el título de la nueva tarea

  // Obtener las tareas de la columna
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(tasks.filter((task) => task.task_id !== taskId));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) return; // Verificar que el título no esté vacío
    try {
      const newTask = {
        title: newTaskTitle,
        description: "",
        status: "",
        columnId: id,
      };
      const response = await fetch(`http://localhost:5000/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTask),
      });
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]); // Agregar la tarea creada a la lista
      setNewTaskTitle(""); // Limpiar el input
      setIsAddingTask(false); // Cerrar el input de añadir tarea
    } catch (error) {
      console.error("Error al añadir la tarea:", error);
    }
  };

  // Nueva función para manejar la edición de tareas
  const handleEditTask = async (taskId, newTitle, newDesc) => {
    try {
      const updatedTask = {
        title: newTitle,
        description: newDesc,
      };

      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT", // O PATCH, dependiendo de tu API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al actualizar la tarea:", errorData);
        return; // Detiene la ejecución si hay un error
      }

      // Actualiza la lista de tareas en el estado
      const updatedTasks = tasks.map((task) =>
        task.task_id === taskId
          ? { ...task, title: newTitle, description: newDesc }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-min max-w-64 min-w-64 w-full flex flex-col gap-2">
      <div className="flex justify-between items-center gap-2">
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-1 w-full"
          />
        ) : (
          <h3 className="font-bold text-lg">{title}</h3>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={() => onEdit(id, newTitle)}
              className="text-green-500 hover:text-green-700"
            >
              <AiOutlineCheck size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <AiOutlineEdit size={20} />
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700"
          >
            <AiOutlineDelete size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400">Sin tareas aún...</p>
        ) : (
          tasks.map((task) => (
            <Task
              key={task.task_id}
              taskId={task.task_id}
              taskTitle={task.title}
              onDelete={handleDeleteTask}
              onClick={() => setSelectedTask(task)}
            />
          ))
        )}
      </div>

      {/* Input para añadir nueva tarea */}
      {isAddingTask ? (
        <div className="flex flex-col gap-2 mt-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Título de la tarea"
            className="border p-2 rounded-md w-full"
          />
          <div className="flex gap-4 w-full">
            <button
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 w-full"
              onClick={handleAddTask}
            >
              Añadir Tarea
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setIsAddingTask(false)}
            >
              <AiOutlineDelete size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-4 w-full p-2 bg-neutral-200 text-black rounded hover:bg-blue-600 hover:text-white"
          onClick={() => setIsAddingTask(true)}
        >
          + Añadir tarea
        </button>
      )}

      {selectedTask && (
        <OpenTask
          taskTitle={selectedTask.title}
          columnName={title}
          taskId={selectedTask.task_id}
          existingDescription={selectedTask.description} // Pasar la descripción existente
          onEdit={handleEditTask} // Usar la nueva función
          onClose={() => setSelectedTask(null)}
        />
      )}
      <span className="flex justify-end text-neutral-300">{columnDate}</span>
    </div>
  );
};

export default Column;