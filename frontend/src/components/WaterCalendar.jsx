import React, { useState } from 'react';
import styles from './WaterCalendar.module.css';

export default function WaterCalendar({ entries, goal }) {
  console.log('📅 WaterCalendar render, entries:', entries.length, 'goal:', goal);

  // Стан для поточного місяця
  const [currentDate, setCurrentDate] = useState(new Date());

  // Групування води по датах
  const grouped = entries.reduce((acc, entry) => {
    const d = new Date(entry.date);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    acc[date] = (acc[date] || 0) + entry.amount;
    return acc;
  }, {});

  console.log('📊 Grouped data:', grouped);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekDay = firstDay.getDay();

  // Функції навігації
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const days = [];

  // порожні клітинки перед першим днем
  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    const total = grouped[key] || 0;
    const percent = Math.min(Math.round((total / goal) * 100), 100);

    days.push({
      day: d,
      percent
    });
  }

  // Назва місяця
  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button onClick={goToPreviousMonth} className={styles.navBtn}>⬅️</button>
        <h4 className={styles.calendarTitle}>{monthNames[month]} {year}</h4>
        <button onClick={goToNextMonth} className={styles.navBtn}>➡️</button>
        <button onClick={goToCurrentMonth} className={styles.todayBtn}>Сьогодні</button>
      </div>

      <div className={styles.calendarGrid}>
        {days.map((d, index) => (
          <div
            key={index}
            className={styles.calendarDay}
            style={{
              background: d
                ? `rgba(0, 150, 255, ${d.percent / 100})`
                : 'transparent'
            }}
          >
            {d && (
              <>
                <span className={styles.dayNumber}>{d.day}</span>
                <span className={styles.percent}>{d.percent}%</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
