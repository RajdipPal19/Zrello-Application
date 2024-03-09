import React, { useState } from 'react';
import './List.scss';

const ListPopup = ({ onSubmit, onClose }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim() === '') return;
        onSubmit(name);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="list-popup">
            <div className="list-popup__content">
                <h2>  ✏️ Lets Add a List</h2>
                <input
                className='inputs'
                    type="text"
                    placeholder="Enter List name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress} // Add keypress event listener
                />
                <div >
                    <button className='btn1' onClick={handleSubmit}>Create</button>
                    <button className='btn2' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ListPopup;
