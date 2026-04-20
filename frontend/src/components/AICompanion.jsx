import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../api';
import styles from './AICompanion.module.css';

export default function AICompanion({ user }) {
  const [messages, setMessages] = useState([
    { 
      from: 'ai', 
      text: 'Привіт! Я твій ШІ-компаньйон ! Запитай щось про воду.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);


  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithAI(user.token, userMessage.text);
      
      console.log('✅ AI Response:', res);
      
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: res.advice || ' Не зміг відповісти' }
      ]);
    } catch (err) {
      console.error('❌ AI Error:', err);
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: '❌ Помилка з\'єднання з AI' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.companion}>
      <h4 className={styles.title}>AI Companion</h4>
      
      <div ref={chatBoxRef} className={styles.chatBox}>
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={styles.messageRow}
            style={{ textAlign: m.from === 'user' ? 'right' : 'left' }}
          >
            <span className={`${styles.message} ${m.from === 'user' ? styles.userMessage : styles.aiMessage}`}>
              {m.text}
            </span>
          </div>
        ))}
        
        {loading && (
          <div style={{ textAlign: 'left' }}>
            <span className={styles.thinking}>
              Думаю...
            </span>
          </div>
        )}
      </div>
      
      <form onSubmit={send} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Напиши повідомлення..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button 
          className={styles.sendButton}
          type="submit"
          disabled={loading || !input.trim()} 
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}