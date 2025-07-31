import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Saved = () => {
  const [savedPhotos, setSavedPhotos] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const colRef = collection(db, "users", user.uid, "savedFeeds");
      const snapshot = await getDocs(colRef);
      setSavedPhotos(snapshot.docs.map(doc => doc.data()));
    };
    fetchSaved();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Saved Photos</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '1rem'
      }}>
        {savedPhotos.map(photo => (
          <div key={photo.id || photo.image_url} style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}>
            <img 
              src={photo.image_url} 
              alt={photo.title || photo.image_url}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                {photo.title || 'No Title'}
              </h3>
              <span style={{
                background: '#a259ff',
                color: 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {photo.category || 'No Category'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;