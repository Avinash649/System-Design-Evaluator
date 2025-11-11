
import { User } from '../types';

const USERS_KEY = 'system_design_users';

// In a real application, passwords should be securely hashed before being stored.
// For this simulation, we are storing them in plaintext for simplicity.

/**
 * Retrieves all users from localStorage.
 * @returns {User[]} An array of user objects.
 */
export const getUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return [];
  }
};

/**
 * Finds a user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {User | undefined} The user object if found, otherwise undefined.
 */
export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Creates a new user and saves them to localStorage.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {User} The newly created user object.
 */
export const createUser = (name: string, email: string, password: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    password, // Storing plaintext password for this mock database. NEVER do this in production.
  };
  
  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  
  return newUser;
};
