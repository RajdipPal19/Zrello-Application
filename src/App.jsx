import React, { useState } from 'react';
import './App.scss';
import Kanban from './components/kanban'; 
import Navbar from './components/kanban/Navbar/index'; 


import image1 from './components/kanban/Navbar/Background/wallpaper/a1.jpg';
import image2 from './components/kanban/Navbar/Background/wallpaper/a2.jpg';
import image3 from './components/kanban/Navbar/Background/wallpaper/a3.jpg';
import image4 from './components/kanban/Navbar/Background/wallpaper/a4.jpg';
import image5 from './components/kanban/Navbar/Background/wallpaper/a5.jpg';
import image6 from './components/kanban/Navbar/Background/wallpaper/a6.jpg';
import image7 from './components/kanban/Navbar/Background/wallpaper/a7.jpg';
import image8 from './components/kanban/Navbar/Background/wallpaper/a8.jpg';
import image9 from './components/kanban/Navbar/Background/wallpaper/a9.jpg';
import image10 from './components/kanban/Navbar/Background/wallpaper/a10.jpg';


function App() {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); 
    const [backgroundImage, setBackgroundImage] = useState(null); 
    const [imageOptions] = useState([
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
        image10
    ]);

    const changeBackgroundImage = (imageUrl) => {
        
        setBackgroundImage(imageUrl);
        document.body.style.backgroundImage = `url(${imageUrl})`; 
    };

    return (
        <div className="app" style={{ backgroundColor, backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <Navbar imageOptions={imageOptions} onSelectBackground={changeBackgroundImage} /> 
            <div style={{ padding: '50px' }}>
                <Kanban />
            </div>
        </div>
    );
}

export default App;
