
import React, { useState, useEffect } from 'react';
import './TaskDetailsPopup.scss';
import ConfirmationWindow from './deleteConfirmationPopup';

const TaskDetailsPopup = ({ task, onClose, onSave,onDelete }) => {
    const [editedTask, setEditedTask] = useState(task ? { ...task } : {});
    const [showConfirmationWindow, setShowConfirmationWindow] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        onSave(editedTask);
        onClose();
    };

    const handleDelete = () => {
        // onDelete(editedTask.listId, editedTask.id); // 
        onClose();
    };

    const confirmDeleteItem = () => {
        if (itemToDelete.type === 'card') {
            const storedLists = JSON.parse(localStorage.getItem('Zrello-lists'));
            const updatedLists = storedLists.map(list => {
                if (list.id === itemToDelete.listId) {
                    return {
                        ...list,
                        cards: list.cards.filter(card => card.id !== itemToDelete.cardId)
                    };
                }
                return list;
            });
            localStorage.setItem('Zrello-lists', JSON.stringify(updatedLists));
            onDelete(itemToDelete.listId, itemToDelete.cardId); 
        }
        setShowConfirmationWindow(false);
        setItemToDelete(null);
    };

    const cancelDeleteItem = () => {
        setShowConfirmationWindow(false);
        setItemToDelete(null);
    };

    const handleDeleteCard = () => {
        setItemToDelete({ type: 'card', listId: editedTask.listId, cardId: editedTask.id });
        setShowConfirmationWindow(true);
    };

    return (
        <div className="task-details-popup">
            <div className="task-details-popup__content">
                <h2>Task Details</h2>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={editedTask.title || ''}
                    onChange={handleChange}
                />
                <label>Status:</label>
                <input
                    type="text"
                    name="status"
                    value={editedTask.status || ''}
                    onChange={handleChange}
                />
                <label>Description:</label>
                <textarea
                    name="description"
                    value={editedTask.description || ''}
                    onChange={handleChange}
                ></textarea>
            </div>
            <div className="task-details-popup__actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={onClose}>Close</button>
            </div>
            {showConfirmationWindow && (
                <ConfirmationWindow
                    itemToDelete={itemToDelete}
                    confirmDeleteItem={confirmDeleteItem}
                    cancelDeleteItem={cancelDeleteItem}
                />
            )}
        </div>
    );
};

export default TaskDetailsPopup;
