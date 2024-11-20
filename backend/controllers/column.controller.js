import { createColumn, getColumnsByBoardId, updateColumn, deleteColumn } from '../models/column.model.js';

export const addColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.boardId; // El ID del tablero se pasa como parámetro

    // Obtener las columnas existentes del tablero
    const existingColumns = await getColumnsByBoardId(boardId);

    // Calcular el valor de position para la nueva columna
    const newPosition = existingColumns.length > 0 ? existingColumns.length + 1 : 1;

    // Crear la nueva columna con el título y la posición calculada
    const newColumn = await createColumn(title, boardId, newPosition);
    
    res.status(201).json(newColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating column' });
  }
};

export const fetchColumns = async (req, res) => {
  try {
    const boardId = req.params.boardId; // El ID del tablero se pasa como parámetro
    const columns = await getColumnsByBoardId(boardId);
    res.status(200).json(columns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching columns' });
  }
};

export const editColumn = async (req, res) => {
  try {
    const { title, position } = req.body;
    const columnId = req.params.columnId; // El ID de la columna se pasa como parámetro

    // Si la posición cambió, actualizamos la posición de todas las columnas
    if (position !== undefined) {
      // Reorganizar columnas si es necesario
      const columns = await getColumnsByBoardId(req.params.boardId);
      const updatedColumns = columns.map((col) => {
        if (col.column_id === columnId) {
          col.position = position;
        }
        return col;
      });

      // Actualizar posiciones de todas las columnas
      for (const column of updatedColumns) {
        await updateColumn(column.column_id, column.title, column.position);
      }
    }

    // Actualizar solo el título de la columna si no hay cambio en la posición
    const updatedColumn = await updateColumn(columnId, title, position);

    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating column' });
  }
};

export const removeColumn = async (req, res) => {
  try {
    const columnId = req.params.columnId; // El ID de la columna se pasa como parámetro
    const boardId = req.params.boardId; // El ID del tablero

    // Obtener todas las columnas del tablero
    const columns = await getColumnsByBoardId(boardId);

    // Buscar la columna que se eliminará
    const columnToDelete = columns.find((col) => col.column_id === parseInt(columnId));

    // Si la columna existe
    if (columnToDelete) {
      // Eliminar la columna
      await deleteColumn(columnId);

      // Reorganizar las posiciones de las columnas restantes
      const columnsToUpdate = columns.filter((col) => col.column_id !== parseInt(columnId));

      // Actualizar las posiciones de las demás columnas
      for (let i = 0; i < columnsToUpdate.length; i++) {
        const column = columnsToUpdate[i];
        const newPosition = i + 1; // Ajustar la posición
        await updateColumn(column.column_id, column.title, newPosition);
      }

      res.status(204).send(); // No hay contenido que devolver
    } else {
      res.status(404).json({ error: 'Column not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting column' });
  }
};