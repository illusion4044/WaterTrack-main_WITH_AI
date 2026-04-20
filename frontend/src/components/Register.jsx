import React, { useState } from 'react';
import { register } from '../api.js';
import styles from './Card.module.css';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 4) {
      setError('Пароль має бути не менше 4 символів');
      return;
    }
    setError('');
    const data = await register(form);
    onRegister(data);
  };

  return (
    <form className={styles.card} onSubmit={submit}>
      <h3>Register</h3>
      <input className={styles.input} placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input className={styles.input} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className={styles.button} type="submit">Sign up</button>
    </form>
  );
}
