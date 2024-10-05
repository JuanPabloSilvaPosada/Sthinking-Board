import { createColumn, getColumnsByBoardId, updateColumn, deleteColumn } from '../models/column.model.js';

export const addColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.boardId; // El ID del tablero se pasa como parámetro
    const newColumn = await createColumn(title, boardId);
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
    const { title } = req.body;
    const columnId = req.params.columnId; // El ID de la columna se pasa como parámetro
    const updatedColumn = await updateColumn(columnId, title);
    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating column' });
  }
};

export const removeColumn = async (req, res) => {
  try {
    const columnId = req.params.columnId; // El ID de la columna se pasa como parámetro
    await deleteColumn(columnId);
    res.status(204).send(); // No hay contenido que devolver
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting column' });
  }
};