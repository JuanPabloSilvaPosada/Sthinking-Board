import { createBoard, getAllBoards, updateBoard, deleteBoard } from '../models/board.model.js';

// Función para crear un tablero
export const addBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id; 
    const newBoard = await createBoard(title, userId);
    res.status(201).json(newBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating board' });
  }
};

// Función para obtener todos los tableros del usuario
export const fetchBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener todos los tableros del usuario
    const boards = await getAllBoards(userId);

    // Si el usuario no tiene tableros, crear uno predeterminado
    if (boards.length === 0) {
      const defaultBoard = await createBoard("Mi SthinkingBoard", userId);
      return res.status(200).json([defaultBoard]); // Retorna el tablero creado
    }

    // Si el usuario tiene tableros, enviarlos como respuesta
    res.status(200).json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching boards' });
  }
};

// Función para actualizar un tablero
export const editBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.boardId; 
    const updatedBoard = await updateBoard(boardId, title);
    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating board' });
  }
};

// Función para eliminar un tablero
export const removeBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    await deleteBoard(boardId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting board' });
  }
};