import React from 'react';
import { Link } from 'react-router-dom';

import quizwizmain3 from '../quizwizmain3.png'

const Main = () => {
    return (
        <div className="main-content home">
            <div className="secondary">
                <h1>Improve your grades. Try QuizWiz for free!</h1>
                <div className="button-container">
                    <Link className="header-links-2" to={"/signup"}>Get Started</Link>
                    <Link className="header-links-2 explore" to={"/decks"}>Explore</Link>
                </div>    
            </div>
            <div className="main-image-container">
                <img className="main-image" src={quizwizmain3}></img>
            </div>
        </div>
        
    );
};

export default Main;

{/* <div className="secondary">TEST</div> */}