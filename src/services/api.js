// src/services/api.js

const API_URL = 'https://localhost:3000';

// Store JWT token in memory (or use localStorage for persistence)
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  // Optional: Store in localStorage for persistence
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

export const contactAPI = {
  // User Registration
 register: async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const data = await response.json();
    if (data.token) setAuthToken(data.token);
    return data;
  } catch (error) {
    throw error;
  }
},

  // User Login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store the token
      if (data.token) {
        setAuthToken(data.token);
      }
      
      return {
        email: credentials.email,
        name: 'User',
        token: data.token,
        userId: data.userId,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    setAuthToken(null);
  },

  // Get all contacts
  getAllContacts: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found');
        return [];
      }

      const response = await fetch(`${API_URL}/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAuthToken(null); // Clear invalid token
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getAllContacts error:', error);
      return [];
    }
  },

  // Create new contact
  createContact: async (contactData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Transform data to match backend schema
      const [first_name, ...lastNameParts] = (contactData.name || '').split(' ');
      const last_name = lastNameParts.join(' ') || '';

      const backendData = {
        first_name: first_name || '',
        last_name: last_name,
        email: contactData.email || '',
        phone_number: contactData.phone || '',
        address: contactData.location || '',
      };

      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAuthToken(null);
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to create contact');
      }

      const data = await response.json();
      
      // Transform response back to frontend format
      return {
        ...contactData,
        id: data.id,
        name: `${data.first_name} ${data.last_name}`.trim(),
        phone: data.phone_number,
        location: data.address,
      };
    } catch (error) {
      console.error('createContact error:', error);
      throw error;
    }
  },

  // Update contact
  updateContact: async (id, contactData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const [first_name, ...lastNameParts] = (contactData.name || '').split(' ');
      const last_name = lastNameParts.join(' ') || '';

      const backendData = {
        first_name: first_name || '',
        last_name: last_name,
        email: contactData.email || '',
        phone_number: contactData.phone || '',
        address: contactData.location || '',
      };

      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAuthToken(null);
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to update contact');
      }

      const data = await response.json();
      
      return {
        ...contactData,
        id: data.id,
        name: `${data.first_name} ${data.last_name}`.trim(),
        phone: data.phone_number,
        location: data.address,
      };
    } catch (error) {
      console.error('updateContact error:', error);
      throw error;
    }
  },

  // Delete contact
  deleteContact: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAuthToken(null);
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to delete contact');
      }

      return { success: true };
    } catch (error) {
      console.error('deleteContact error:', error);
      throw error;
    }
  },
};