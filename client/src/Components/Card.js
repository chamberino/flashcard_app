import React, { Component } from 'react';

import { fadeInRight, fadeInLeft, flipInX, flipOutX } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
    fadeInRight: {
      animation: 'x .5s',
      animationName: Radium.keyframes(fadeInRight, 'fadeInRight')
    },
    fadeInLeft: {
      animation: 'x .5s',
      animationName: Radium.keyframes(fadeInLeft, 'fadeInLeft')
    },
    flipInX: {
        animation: 'x 1s',
        animationName: Radium.keyframes(flipInX, 'flipInX')
      },
    flipOutX: {
        animation: 'x .5s',
        animationName: Radium.keyframes(flipOutX, 'flipOutX')
    }  
  }

/* 
  Deck component receives props from DecksContainer
  The props passed down in DecksContainer from Decks is mapped over returning 
  this Deck component for each deck in the decks array returned from the API
*/

export default class Card extends Component {


    componentDidMount() {
        const body = document.querySelector('BODY');
        body.addEventListener('click', this.inputBlur)

        // setTimeout(() => { 
        //     document.querySelector('.card-container').style.animation = null;
        // }, 1000);
      }

      componentWillUnmount() {
        const body = document.querySelector('BODY');
        body.removeEventListener('click', this.inputBlur)          
      }

      inputBlur = (e) => {
        if (e.target.nodeName !== "INPUT") {
            console.log(e.target.classList.contains("svg-edit-active"))
            document.querySelectorAll("INPUT[type=text]").forEach(input => input.disabled=true)
            document.querySelectorAll(".svg-flex").forEach(svg => svg.classList.remove("svg-edit-active"))
            document.querySelectorAll(".form-buttons-update").forEach(formButtons => formButtons.style.display="none")
        }
      }

    scrollToCard = () => {
        const card = document.getElementById(`${this.props.props.deck.cards[this.props.props.score]._id}`);
        const input = document.querySelectorAll(`.input-${this.props.props.deck.cards[this.props.props.score]._id}`);
        const svg = document.getElementById(`svg-${this.props.props.deck.cards[this.props.props.score]._id}`);
        const formButtons = document.querySelector(`.form-buttons-update-${this.props.props.deck.cards[this.props.props.score]._id}`);

        formButtons.style.display="flex";
        svg.classList.toggle("svg-edit-active")
        input.forEach(input=>input.disabled=false)
        card.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
    
    render(props) {
        return (
<div className="bounds card--detail">

{/* Check to see if there are flashcards in deck */}
    { (this.props.props.amountOfCards <= 0)
            ? (<p>There are no flashcards in this deck</p>)
            : (
        <StyleRoot>
        <div className="card-container" style={this.props.props.fade}>
        {/* <ReactCardFlip flipSpeedBackToFront={1} isFlipped={this.props.props.isFlipped} flipDirection="vertical"> */}
            <div className="card-quiz" onClick={this.props.props.flipCard}>
                <div className="edit-card-icons">
                <svg onClick={this.scrollToCard} className="svg-icon-edit" viewBox="0 0 20 20">
                                <path fill="none" d="M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z"></path>
                </svg>
                {/* Checks if hint exists*/}
                {
                    (this.props.props.deck.cards[this.props.props.score]["hint"] === undefined)
                        ? (null)
                        : <button className="show-hint hint-card" onClick={this.props.props.showHint}><svg className="svg-icon-hint" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 8.51v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm5.521 1.544l1.57-1.743 1.019.918-1.603 1.777c-.25-.297-.593-.672-.986-.952zm-10.738.952l-1.603-1.777 1.019-.918 1.57 1.743c-.392.28-.736.655-.986.952zm-1.597 5.429h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681zm9.462 9.118h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-1.989c-.003-1.858.87-3.389 1.721-4.867.761-1.325 1.482-2.577 1.482-3.932 0-2.592-2.075-3.772-4.003-3.772-1.925 0-3.997 1.18-3.997 3.772 0 1.355.721 2.607 1.482 3.932.851 1.478 1.725 3.009 1.72 4.867h-1.988c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772z"/></svg></button>
                }
                </div>
                <h3 className="card--question">{this.props.props.deck.cards[this.props.props.score][this.props.props.sideOfCard]}</h3>        
                <div className="card--hint">
            
                { (this.props.props.hint == null)
                    ?   (
                        <div className="grid-66">                            
                        <h3 className="card--hint">&nbsp;&nbsp;</h3>
                        </div>
                        )
                    :   (
                        <div className="grid-66">
                            <h3 className="card--hint">{this.props.props.deck.cards[this.props.props.score][this.props.props.hint]}</h3>
                        </div>
                       )
                }
                </div>
            </div>
        </div>
        </StyleRoot>
            )
    }        

    <div className="card-options">
        
        {/* instead of rendering next and previous as null change class so you can gray out buttons */}

        {/* Checks if at the beginning of deck*/}
        {
            (this.props.props.score > 0)
                ? <button className="previous-card" onClick={this.props.props.previousCard}> ← </button>
                : <button className="previous-card-disabled" onClick={this.props.props.previousCard}> ← </button>
        }

        <button className="flip-card" onClick={this.props.props.flipCard}><svg className="svg-icon-flip" viewBox="0 0 20 20">
                <path d="M12.319,5.792L8.836,2.328C8.589,2.08,8.269,2.295,8.269,2.573v1.534C8.115,4.091,7.937,4.084,7.783,4.084c-2.592,0-4.7,2.097-4.7,4.676c0,1.749,0.968,3.337,2.528,4.146c0.352,0.194,0.651-0.257,0.424-0.529c-0.415-0.492-0.643-1.118-0.643-1.762c0-1.514,1.261-2.747,2.787-2.747c0.029,0,0.06,0,0.09,0.002v1.632c0,0.335,0.378,0.435,0.568,0.245l3.483-3.464C12.455,6.147,12.455,5.928,12.319,5.792 M8.938,8.67V7.554c0-0.411-0.528-0.377-0.781-0.377c-1.906,0-3.457,1.542-3.457,3.438c0,0.271,0.033,0.542,0.097,0.805C4.149,10.7,3.775,9.762,3.775,8.76c0-2.197,1.798-3.985,4.008-3.985c0.251,0,0.501,0.023,0.744,0.069c0.212,0.039,0.412-0.124,0.412-0.34v-1.1l2.646,2.633L8.938,8.67z M14.389,7.107c-0.34-0.18-0.662,0.244-0.424,0.529c0.416,0.493,0.644,1.118,0.644,1.762c0,1.515-1.272,2.747-2.798,2.747c-0.029,0-0.061,0-0.089-0.002v-1.631c0-0.354-0.382-0.419-0.558-0.246l-3.482,3.465c-0.136,0.136-0.136,0.355,0,0.49l3.482,3.465c0.189,0.186,0.568,0.096,0.568-0.245v-1.533c0.153,0.016,0.331,0.022,0.484,0.022c2.592,0,4.7-2.098,4.7-4.677C16.917,9.506,15.948,7.917,14.389,7.107 M12.217,15.238c-0.251,0-0.501-0.022-0.743-0.069c-0.212-0.039-0.411,0.125-0.411,0.341v1.101l-2.646-2.634l2.646-2.633v1.116c0,0.174,0.126,0.318,0.295,0.343c0.158,0.024,0.318,0.034,0.486,0.034c1.905,0,3.456-1.542,3.456-3.438c0-0.271-0.032-0.541-0.097-0.804c0.648,0.719,1.022,1.659,1.022,2.66C16.226,13.451,14.428,15.238,12.217,15.238"></path>
            </svg></button>

        {/* Checks if at the end of deck*/}
        {
            (this.props.props.score < this.props.props.amountOfCards-1)
                ? <button className="next-card" onClick={this.props.props.nextCard}> → </button>
                : <button className="next-card-disabled" onClick={this.props.props.nextCard}> → </button>
        }

    </div>
    <p className="centered">{this.props.props.score+1}/{this.props.props.amountOfCards}</p>
</div>
        )
    }
}
// export default Card;
// {/* <button className="counter-action increment" onClick={this.incrementScore}> + </button> */}