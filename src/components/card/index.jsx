import React, { useState } from 'react';
import './card.scss';

const Card = ({ onCreateItem }) => {
    const [name, setName] = useState('');

    const handleCreateItem = () => {
        if (name.trim() === '') return;
        onCreateItem(name);
        setName('');
    };

    return (
        <div className='card'>
            <input
                type="text"
                placeholder="Enter card name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleCreateItem}>Create</button>
        </div>
    );
};

export default Card;
