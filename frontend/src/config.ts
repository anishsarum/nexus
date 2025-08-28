// Centralized API base URLs for MERN and Python backends

export const pythonApiUrl =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PYTHON_API_URL
    ? import.meta.env.VITE_PYTHON_API_URL
    : '/pyapi';

export const mernApiUrl =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MERN_API_URL
    ? import.meta.env.VITE_MERN_API_URL
    : '';
