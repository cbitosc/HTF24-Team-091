import React, { useState } from 'react';
import CreateRecipe from '../components/CreateRecipe';

export default function ImproveSkills() {
    const [isOpen, setIsOpen] = useState(false);
    const list = [
        "Learn New Recipes",
        "Experiment with Food",
        "Write your own recipes",
        "Get the perfect recipe",
    ];

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="section improve-skills">
            <div className="col img">
                <img id="myImage" src="/img/gallery/img_10.jpg" alt="Culinary Skills" />
            </div>
            <div className="col typography">
                <h1 className="title">Let's Build our Culinary Skills</h1>
                {list.map((item, index) => (
                    <p className="skill-item" key={index}>{item}</p>
                ))}
                {<CreateRecipe />}
            </div>
        </div>
    );
}
