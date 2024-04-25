import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import './kanban.scss';
import ListPopup from './ListPopup';
import ConfirmationWindow from './deleteConfirmationPopup';
import CardPopup from './CardPopup';
import TaskDetailsPopup from './TaskDetailsPopup';

const Kanban = () => {
    const [lists, setLists] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [activeList, setActiveList] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDeleteTaskPopup, setShowDeleteTaskPopup] = useState(false); 


    const [showConfirmationWindow, setShowConfirmationWindow] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); 

 
    const [isEditingListName, setIsEditingListName] = useState(null);
    const [showNotification, setShowNotification] = useState(false);


    useEffect(() => {
        const storedLists = JSON.parse(localStorage.getItem('Zrello-lists'));
        if (storedLists) {
            setLists(storedLists);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('Zrello-lists', JSON.stringify(lists));
    }, [lists]);

    const handleListNameEdit = (listId, newName) => {
        if (newName.length > 15) {
            setShowNotification(true);
            return;
        }else if(newName.length===0){
            setShowNotification(true);
            return;
        }

        const updatedLists = lists.map(list => {
            if (list.id === listId) {
                return { ...list, title: newName };
            }
            return list;
        });
        setLists(updatedLists);
    };


    const saveListNameChanges = (listId) => {
        
        const list = lists.find(list => list.id === listId);
        console.log(`List "${list.title}" (${list.id}) name changed to "${list.title}"`);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            const updatedList = lists.find(list => list.id === source.droppableId);
            const movedCard = updatedList.cards.splice(source.index, 1)[0];
            updatedList.cards.splice(destination.index, 0, movedCard);

            setLists(prevLists => prevLists.map(list => list.id === source.droppableId ? updatedList : list));
        } else {
            const sourceList = lists.find(list => list.id === source.droppableId);
            const destinationList = lists.find(list => list.id === destination.droppableId);
            const movedCard = sourceList.cards.splice(source.index, 1)[0];
            destinationList.cards.splice(destination.index, 0, movedCard);

            setLists(prevLists => prevLists.map(list => {
                if (list.id === source.droppableId) return sourceList;
                if (list.id === destination.droppableId) return destinationList;
                return list;
            }));
        }
    };

    const handleCreateList = () => {
        setActiveList(null);
        setShowPopup(true);
    };

    const handleListCreation = (name) => {
        const newList = {
            id: uuidv4(),
            title: name,
            cards: [],
        };
        setLists([...lists, newList]);
        setShowPopup(false);
    };

    const handleCreateCard = (listId) => {
        setActiveList(listId);
        setShowPopup(true);
    };

    const handleCardCreation = () => {
        if (newCardTitle.trim() === '' || activeList === null) return;

        const updatedLists = lists.map(list => {
            if (list.id === activeList) {
                return {
                    ...list,
                    cards: [...list.cards, { id: uuidv4(), title: newCardTitle }]
                };
            }
            return list;
        });

        setLists(updatedLists);
        setNewCardTitle('');
        setActiveList(null);
        setShowPopup(false);
    };

    const handleDeleteList = (listId) => {
        setItemToDelete({ id: listId, type: 'list' });
        setShowConfirmationWindow(true);
    };

    const handleDeleteCard = (listId, cardId) => {
        setItemToDelete({ listId, cardId, type: 'card' });
        setShowConfirmationWindow(true);
    };

    const confirmDeleteItem = () => {
        if (itemToDelete.type === 'list') {
            const updatedLists = lists.filter(list => list.id !== itemToDelete.id);
            setLists(updatedLists);
        } else if (itemToDelete.type === 'card') {
            const { listId, cardId } = itemToDelete;
            const updatedLists = lists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: list.cards.filter(card => card.id !== cardId)
                    };
                }
                return list;
            });
            setLists(updatedLists);
        }
        setShowConfirmationWindow(false);
        setItemToDelete(null);
    };

    const cancelDeleteItem = () => {
        setShowConfirmationWindow(false);
        setItemToDelete(null);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowDeleteTaskPopup(false); 
    };

    const Popup = ({ onClose }) => {
        return (
            <div className="popup">
                <p>List name contain 1 to 15 characters.</p>
                <button className='closeBtn' onClick={onClose}>Close</button>
            </div>
        );
    };
    
    const handleTaskSave = (editedTask) => {
        if (editedTask.markedForDeletion) {
            const updatedLists = lists.map(list => ({
                ...list,
                cards: list.cards.filter(card => card.id !== editedTask.id)
            }));
            setLists(updatedLists);
        } else {
            const updatedLists = lists.map(list => ({
                ...list,
                cards: list.cards.map(card => (card.id === editedTask.id ? editedTask : card))
            }));
            setLists(updatedLists);
        }

        setSelectedTask(null);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban">
                {lists.map(list => (
                    <Droppable key={list.id} droppableId={list.id}>
                        {(provided) => (
                            <div className="kanban__list" ref={provided.innerRef}>
                                <div className="kanban__list__title">
                                    {isEditingListName === list.id ? (
                                        <>
                                            <input
                                               className='form-control'
                                                type="text"
                                                value={lists.find(l => l.id === list.id)?.title}
                                                onChange={e => {
                                                    if (e.target.value.length > 10) {
                                                        setShowNotification(true); 
                                                    } else {
                                                        setShowNotification(false);
                                                    }
                                                    handleListNameEdit(list.id, e.target.value);
                                                }}
                                                onBlur={() => {
                                                    setIsEditingListName(null);
                                                    saveListNameChanges(list.id);
                                                }}
                                                autoFocus
                                            />

                                            <button className="save-list-name" onClick={() => {
                                                setIsEditingListName(null);
                                                saveListNameChanges(list.id);
                                            }}>Save</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="kanban__list__name-button" onClick={() => setIsEditingListName(list.id)}>
                                                {lists.find(l => l.id === list.id)?.title}
                                            </button>
                                           
                                        </>
                                    )}
                                    {!isEditingListName && <div className="kanban__list__counter">Tasks: {list.cards.length}</div>}
                                </div>
                                <div className="kanban__list__cards">
                                    {list.cards.map((card, index) => (
                                        <Draggable key={card.id} draggableId={card.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="kanban__list__card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => handleTaskClick(card)} // 
                                                >
                                                    {card.title}
                                                    <button
                                                        className='deletes'
                                                        onClick={() => handleDeleteCard(list.id, card.id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                                <button className="kanban__list__add-card" onClick={() => handleCreateCard(list.id)}>+ Add Task</button>
                                <button className="kanban__list__delete" onClick={() => handleDeleteList(list.id)}>Delete List</button>
                            </div>
                        )}
                    </Droppable>
                ))}
                <button className="kanban__add-list" onClick={handleCreateList}>+ New List</button>
                {showPopup && activeList === null && <ListPopup onSubmit={handleListCreation} onClose={() => setShowPopup(false)} />}
                {showPopup && activeList !== null && <CardPopup handleCardCreation={handleCardCreation} setNewCardTitle={setNewCardTitle} onClose={() => setShowPopup(false)} />}
                {showConfirmationWindow && (
                    <ConfirmationWindow
                        taskName={itemToDelete.type === 'list' 
                                  ? lists.find(list => list.id === itemToDelete.id)?.title 
                                  : lists.find(list => list.id === itemToDelete.listId)?.cards.find(card => card.id === itemToDelete.cardId)?.title}
                        onDelete={confirmDeleteItem}
                        onCancel={cancelDeleteItem}
                    />
                )}
            </div>
            {showDeleteTaskPopup && (
                <ConfirmationWindow
                    taskName="Selected Task"
                    onDelete={() => { 
                        handleDeleteCard(selectedTask.listId, selectedTask.id);
                        setSelectedTask(null);
                        setShowDeleteTaskPopup(false);
                    }}
                    onCancel={() => setShowDeleteTaskPopup(false)}
                />
            )}
            {selectedTask && (
                <TaskDetailsPopup
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSave={handleTaskSave} 
                    onDelete={confirmDeleteItem}
                />
            )}
            {showNotification && <Popup onClose={() => setShowNotification(false)} />} 
        </DragDropContext>
    );
};

export default Kanban;



