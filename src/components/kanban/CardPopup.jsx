import React from 'react';
import './cardpops.scss'; 

const CardPopup = ({ newCardTitle, setNewCardTitle, handleCardCreation, onClose }) => {

    const handleCancelClick = () => {
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCardCreation(); // Trigger card creation on Enter key press
        }
    };

    return (
        <>
            <div className="card-popup-overlay" onClick={onClose}> </div>
            <div className="card-popup-container">
                <h2>  ✏️  Let's add a Task</h2>
                <input
                    className="card-popup-input"
                    type="text"
                    placeholder="Enter Task title"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle( e.target.value)}
                    onKeyPress={handleKeyPress} // Add keypress event listener
                />
                <div className="card-popup-buttons">
                    <button className="card-popup-button card-popup-button-primary" onClick={handleCardCreation}>Add</button>
                    <button className="card-popup-button card-popup-button-secondary" onClick={handleCancelClick}>Cancel</button>
                </div>
            </div>
          
        </>
    );
};

export default CardPopup;
