import pool from '../config/db.js';

// Función para obtener un usuario por nombre de usuario o correo electrónico
export const getUserByCredentials = async (usernameOrEmail) => {
  try {
    const res = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [usernameOrEmail]
    );
    if (res.rows.length === 0) {
      return null; // Si no se encuentra el usuario, devuelve null
    }
    return res.rows[0];
  } catch (error) {
    throw new Error('Database error');
  }
};

// Función para crear un usuario
export const createUser = async (username, email, password) => {
  try {
    const res = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    return res.rows[0]; // Retorna el usuario creado
  } catch (error) {
    throw new Error('Database error');
  }
};

// Función para obtener un usuario por correo electrónico
export const getUserByEmail = async (email) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      return null; // Si no se encuentra el usuario, devuelve null
    }
    return res.rows[0];
  } catch (error) {
    throw new Error('Database error');
  }
};

// Función para actualizar la contraseña del usuario
export const updateUserPassword = async (userId, newPassword) => {
  try {
    await pool.query('UPDATE users SET password = $1 WHERE user_id = $2', [newPassword, userId]);
  } catch (error) {
    throw new Error('Database error');
  }
};

// Función para cambiar la contraseña usando el correo electrónico
export const changePasswordByEmail = async (email, newPassword) => {
  try {
    // Primero obtenemos al usuario por su correo
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    // Si el usuario existe, actualizamos su contraseña
    await updateUserPassword(user.user_id, newPassword);
  } catch (error) {
    throw new Error('Database error');
  }
};

// Función para eliminar el usuario
export const deleteUserById = async (userId) => {
  try {
    await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
  } catch (error) {
    throw new Error('Database error');
  }
};