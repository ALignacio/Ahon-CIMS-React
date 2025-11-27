import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChildCard.module.css';
import { getAge, formatDate } from '../../utils';

export default function ChildCard({ child, onSelect }) {
  const navigate = useNavigate();
  if (!child) return null; // safety

  return (
    <li className={styles.card} onClick={() => onSelect(child)}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {child.photo_url ? (
            <img
              src={child.photo_url}
              alt={`${child.first_name} ${child.last_name}`}
            />
          ) : (
            <div className={styles.placeholder}>👤</div>
          )}
        </div>

        <div className={styles.title}>
          <div className={styles.name}>
            {child.first_name} {child.last_name}
          </div>
          <div className={styles.meta}>
            Age: {child.date_of_birth ? getAge(child.date_of_birth) : '—'} years
          </div>
        </div>

        <span className={styles.status}>
          {(child.status || 'Active').toLowerCase()}
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <span>ID:</span>
          <span>{child.sponsorship_id || '—'}</span>
        </div>
        <div>
          <span>Gender:</span>
          <span>{child.gender || '—'}</span>
        </div>
        <div>
          <span>Date of Birth:</span>
          <span>{formatDate(child.date_of_birth)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            navigate(`/child-records/${child.id}`);
          }}
        >
          <span>👁️</span> View Details
        </button>
      </div>
    </li>
  );
}
