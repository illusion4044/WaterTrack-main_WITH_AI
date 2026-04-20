import React, { useEffect, useState } from 'react';
import { addWater, getWaterData, updateWaterEntry } from '../api';
import WaterCalendar from './WaterCalendar';
import AICompanion from './AICompanion';
import cardStyles from './Card.module.css';
import styles from './Dashboard.module.css';

export default function Dashboard({ user }) {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [error, setError] = useState('');
  const [goal] = useState(2000);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('🔄 Fetching water data...');
    const res = await getWaterData(user.token);
    console.log('📦 API Response:', res);
    if (!res.message) {
      console.log('✅ Setting entries:', res.length);
      setEntries(res);
      setError('');
    } else {
      console.log('❌ API Error:', res.message);
      setError(res.message);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!amount) return;

    console.log('💧 Adding water:', amount);
    await addWater(user.token, Number(amount));
    setAmount('');
    console.log('🔄 Calling fetchData after add...');
    fetchData();
  };

  const startEdit = (entry) => {
    setEditingEntryId(entry._id);
    setEditAmount(entry.amount.toString());
  };

  const cancelEdit = () => {
    setEditingEntryId(null);
    setEditAmount('');
  };

  const saveEdit = async (entryId) => {
    if (!editAmount || Number(editAmount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      const res = await updateWaterEntry(user.token, entryId, Number(editAmount));
      if (res.message) {
        console.error('Update error:', res.message);
        setError(res.message);
        return;
      }

      setEditingEntryId(null);
      setEditAmount('');
      setError('');
      fetchData();
    } catch (err) {
      console.error('Save edit failed:', err);
      setError('Failed to save entry. Please try again.');
    }
  };

  const totalToday = entries
    .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className={`${cardStyles.card} ${styles.dashboard}`}>
      <h3>Dashboard</h3>

      {/* СЬОГОДНІШНІЙ ПРОГРЕС */}
      <div>
        Today: {totalToday} / {goal} ml
        <progress className={styles.progressBar} value={totalToday} max={goal}></progress>
      </div>

      {/* ДОДАТИ ВОДУ */}
      <form onSubmit={add}>
        <input
          className={cardStyles.input}
          type="number"
          placeholder="Amount ml"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button className={cardStyles.button}>Add</button>
      </form>

      {/* ІСТОРІЯ ДОДАВАННЯ ВОДИ */}
      <div className={styles.history}>
        <h4>Water History</h4>
        {error && <p className={styles.errorMessage}>{error}</p>}

        {entries.length === 0 ? (
          <p>No records yet</p>
        ) : (
          <div className={styles.historyContainer}>
            <ul className={styles.entries}>
              {entries
                .slice()
                .reverse()
                .map(entry => {
                  const date = new Date(entry.date);
                  const time = date.toLocaleTimeString('uk-UA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  const dateStr = date.toLocaleDateString('uk-UA', {
                    day: '2-digit',
                    month: '2-digit'
                  });
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <li key={entry._id} className={styles.entryItem}>
                      {editingEntryId === entry._id ? (
                    <div className={styles.editingRow}>
                      <input
                        className={styles.editInput}
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                      />
                      <div className={styles.entryActions}>
                        <button className={styles.editButton} type="button" onClick={() => saveEdit(entry._id)}>Зберегти</button>
                        <button className={styles.cancelButton} type="button" onClick={cancelEdit}>Скасувати</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span><strong>{entry.amount} ml</strong> —  {time} ·  {isToday ? 'Сьогодні' : dateStr}</span>
                      <button className={styles.editButton} type="button" onClick={() => startEdit(entry)}>Редагувати</button>
                    </>
                  )}
                    </li>
                  );
                })}
            </ul>
            {entries.length > 0 && (
              <div className={styles.historyFooter}>
                <span className={styles.historyNote}>
                  Загалом записів: {entries.length}
                </span>
                
              </div>
            )}
          </div>
        )}
      </div>

      {/* КАЛЕНДАР */}
      <WaterCalendar entries={entries} goal={goal} />

      {/* AI КОМПАНЬЙОН */}
      <AICompanion user={user} />

    </div>
  );
}