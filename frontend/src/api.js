const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// AUTH
export const register = (data) =>
  fetch(`${API}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const login = (data) =>
  fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

// WATER
export const addWater = (token, amount) =>
  fetch(`${API}/water`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount }),
  }).then(res => res.json());

export const updateWaterEntry = (token, id, amount) =>
  fetch(`${API}/water/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount }),
  }).then(res => res.json());

export const getWaterData = (token) =>
  fetch(`${API}/water`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

// AI-компаньйон
export const chatWithAI = (token, message) =>
  fetch(`${API}/water/advice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  }).then(res => res.json());