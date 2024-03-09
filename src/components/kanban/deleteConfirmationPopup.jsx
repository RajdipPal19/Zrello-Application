import React from 'react';
import './deletepopup.scss';

const DeleteConfirmationPopup = ({ taskName, onDelete, onCancel }) => {
    return (
        <div className="confirmation-popup">
            <div className="confirmation-popup__content">
                <p>Are you sure you want to delete "{taskName}"?</p>
                <div className="confirmation-popup__buttons">
                    <button className='btn1' onClick={onDelete}>Delete</button>
                    <button className='btn2' onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationPopup;
