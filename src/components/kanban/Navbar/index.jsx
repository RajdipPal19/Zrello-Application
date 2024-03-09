// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.scss';
import profileAvatar from './resume.png';

function Navbar({ imageOptions, onSelectBackground }) {
    const [showBackgroundSwitcher, setShowBackgroundSwitcher] = useState(false);

    const handleToggleBackgroundSwitcher = () => {
        setShowBackgroundSwitcher(!showBackgroundSwitcher);
    };

    const handleImageClick = (imageUrl) => {
        onSelectBackground(imageUrl);
        setShowBackgroundSwitcher(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader(); 

        reader.readAsDataURL(file);

        reader.onload = () => {
            onSelectBackground(reader.result); 
            setShowBackgroundSwitcher(false); 
        };
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleAddImage = () => {
        document.getElementById('file-input').click();
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-profile">
                    <img src={profileAvatar} alt="User Avatar" className="profile-avatar" /> 
                    <span className="profile-name">Rajdip Pal</span>
                </div>
                <div className="navbar-search-container">
                    <input type="text" placeholder="Search your boards here..." className="navbar-search" title="Search something"/>
                </div>
            </div>
            <div className='divs'>
                 <img src='unnamed.png' alt='image not found' className='logo'></img>
            <span className="navbar-title" onClick={handleRefresh} title="Click to refresh the page">
                Zrello
            </span>
            </div>
           
            <div className="navbar-right">
                <button className="navbar-button" onClick={handleToggleBackgroundSwitcher} title='Change your background'>Customize</button>
                {showBackgroundSwitcher && (
                    <div className="background-switcher">
                        {imageOptions.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Wallpaper ${index + 1}`}
                                className="background-thumbnail"
                                onClick={() => handleImageClick(imageUrl)}
                            />
                        ))}
                       
                        <label htmlFor="file-input" className="add-image-button">
                            <span className="plus-icon">+</span>
                        </label>
                        <input type="file" id="file-input" accept="image/*" onChange={handleFileUpload} className="custom-file-input" />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
