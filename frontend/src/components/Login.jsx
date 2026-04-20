import React, { useState } from 'react';
import { login } from '../api.js';
import styles from './Card.module.css';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    const data = await login(form);
    onLogin(data);
  };

  return (
    <form className={styles.card} onSubmit={submit}>
      <h3>Login</h3>
      <input className={styles.input} placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input className={styles.input} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button className={styles.button} type="submit">Sign in</button>
    </form>
  );
}
