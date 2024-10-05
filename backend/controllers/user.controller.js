import { getUserByCredentials, getUserByEmail, createUser, changePasswordByEmail, deleteUserById } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Función para iniciar sesión
export const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }  

  try {
    const user = await getUserByCredentials(usernameOrEmail);
    if (!user) {
      return res.status(404).json({ error: 'Usuario Inexistente' }); // Mensaje específico
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales Incorrectas' }); // Mensaje específico
    }

    const token = jwt.sign({ id: user.user_id, username: user.username }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  const { username, email, password, verifyPassword } = req.body;

  if (!username || !email || !password ||!verifyPassword) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }  

  // Verificar si las contraseñas coinciden
  if (password !== verifyPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  try {
    // Verificar si el nombre de usuario ya existe
    const existingUserByUsername = await getUserByCredentials(username);
    if (existingUserByUsername) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    // Verificar si el correo electrónico ya existe
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ error: 'El correo ya esta en uso' });
    }

    // Crear el nuevo usuario si no hay conflictos
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Función para cambiar la contraseña de un usuario
export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await changePasswordByEmail(email, hashedPassword);
    res.status(200).json({ message: 'Contraseña cambiada con exito' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Función para eliminar un usuario
export const removeUser = async (req, res) => {
  const userId = req.user.id; // Suponiendo que el ID del usuario está en req.user

  try {
    await deleteUserById(userId);
    res.status(204).json({ message : "Usuario eliminado correctamente"});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};