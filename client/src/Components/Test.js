import React, { Component } from 'react';
import Form from './Form';
import createCardInputs from './CreateCardInputs'
import CreateCardInputs from './CreateCardInputs';


export default class CardForm extends React.Component {

  constructor() {
    super();
    this.state = {
      question: "",
      answer: "",
      cards: [{ question: "", answer: "" , hint: ""}],
      errors: []
    };
  }

  handleCardQuestionChange = idx => evt => {
    const newCards = this.state.cards.map((card, cidx) => {
      if (idx !== cidx) return card;
      return { ...card, question: evt.target.value };
    });

    this.setState({ cards: newCards });
  };

  handleCardAnswerChange = idx => evt => {
    const newCards = this.state.cards.map((card, cidx) => {
      if (idx !== cidx) return card;
      return { ...card, answer: evt.target.value };
    });

    this.setState({ cards: newCards });
  };

  handleCardHintChange = idx => evt => {
    const newCards = this.state.cards.map((card, cidx) => {
      if (idx !== cidx) return card;
      return { ...card, hint: evt.target.value };
    });

    this.setState({ cards: newCards });
  };

  handleSubmit = evt => {
    const { question, answer, cards } = this.state;
    alert(`Created: ${question} ${answer} with ${cards.length} cards`);
  };

  handleAddCard = () => {
    this.setState({
      cards: this.state.cards.concat([{ question: "", answer: "", hint: "" }])
    });
  };

  handleRemoveCard = idx => () => {
    this.setState({
      cards: this.state.cards.filter((c, cidx) => idx !== cidx)
    });
  };

  cancel = () => {
      // access the history object via props, and push the error route
      this.props.history.push('/profile');
    }

  render() {
    return (
      <Form submit={this.handleSubmit} cancel={this.cancel}
            errors={this.state.errors}
            submit={this.handleSubmit}
            submitButtonText="Done"
            elements={() => (
              <React.Fragment>
              <div>
        {this.state.cards.map((card, idx) => (
          <div className="card" key={idx+1}>
            <input
              type="text"
              placeholder={`Card #${idx + 1} question`}
              value={card.question}
              onChange={this.handleCardQuestionChange(idx)}
              // key={idx+1}
            />
            <input
              type="text"
              placeholder={`Card #${idx + 1} answer`}
              value={card.answer}
              onChange={this.handleCardAnswerChange(idx)}
              // key={idx+1}
            />
            <input
              type="text"
              placeholder={`Card #${idx + 1} hint`}
              value={card.hint}
              onChange={this.handleCardHintChange(idx)}
              // key={idx+1}
            />
            <button
              type="button"
              onClick={this.handleRemoveCard(idx)}
              className="small"
              // key={idx+1}
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={this.handleAddCard}
          className="small"
        >
          + Add Card
        </button>
        </div>
        </React.Fragment>
        )} />
    );
  } 
}

// export default class Test extends Component {

//   constructor(props) {
//     super(props);
//   this.state= {
//     testState: {
//       name: 'Michael',
//       age: 31
//     },
//     inputFields: 1,
//     cardArray: [
//       {
//         question: '',
//         answer: '',
//         hint: '',
//         id: 1,
//       },
//       {
//         question: '',
//         answer: '',
//         hint: '',
//         id: 2,
//       },
//     ],
//     question: '',
//     answer: '',
//     hint: '',
//   };
// }

// submit = () => {
//   // Data is passed to the component via a prop named context. 
//   // Destructuring is used to extract the value from props. 
//   const { context } = this.props;

//   // unpack the name, username and password properties from 
//   // the state object (this.state) into distinct variables
//   const {

//   } = this.state;

//   this.setState({  });
// }

// handleAddCard = () => {
//   this.setState({
//     cardArray: this.state.shareholders.concat([{ question: "" }])
//   });
// };

// handleAddCardInputs = () => {
//   // updates cardArray state by taking previous contents and adding new object
//   this.setState( prevState => {
//     return {
//       cardArray: [
//         ...prevState.cardArray,
//         {
//           test: 'test'
//         }
//       ]
//     };
//   });
// }


// change = (event) => {
//   // Any changes made in the input fields will update it's corresponding property in state
//   const name = event.target.name;
//   const value = event.target.value;
//   this.setState(() => {
//     return {
//       [name]: value,      
//     };
//   });
// }

// cancel = () => {
//   // access the history object via props, and push the error route
//   this.props.history.push('/profile');
// }
  
//   render() {
//     this.state.testState.name = 'cameron'
//     this.state.cardArray.map((element, index)=>{console.log(element.question)})
//     return (
//       <div>
//       <Form 
//       cancel={this.cancel}
//       errors={[]}
//       submit={this.submit}
//       submitButtonText="Create Card"
//       // elements prop is a function  which returns
//       // the input fields to be used in each of the forms
//       elements={() => (
//         this.state.cardArray.map((element, index)=>{return <CreateCardInputs onChange={this.change} question={element.question} answer={this.answer} hint={this.hint} value={this.hint} key={index} cardNumber={index+1}/>})

//     )} />
//     <button onClick={() =>this.handleAddCardInputs()}>Add Card</button>
//     </div>
//     )
//   }
// }
