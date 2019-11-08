import { Component } from 'react';

export default class DeleteDeckWithContext extends Component {

    constructor(props) {
    super(props);
    this.state= { 
    deleteCard: props.context.actions.deleteCard, 
    props: props,  
    cardId: props.match.params.id,  
    userId: props.context.authenticatedUser.user.user.id,
    credentials: props.context.authenticatedUser.user.token
    }
  }

  componentDidMount() {      
    // Make a DELETE request to the API and return user to the deck.

    this.props.context.actions.getCard(this.state.cardId)
      .then((card)=>{
        // NOTE!:: Why is this setting error state to the returned card?
        this.setState({
            error: card,
          })
        if (card.errorStatus || card.message) {
          console.log(card)
            this.props.history.push(`/notfound`);
            return null
          } else {
          this.setState({
            cardCreatorId: card.userId,
            foundCard: true,
            deckId: card.deckId
          })
        }
      }).then(()=>{
        if (!this.state.foundCard) {
          this.props.history.push(`/notfound`);
        }
        else if (this.state.cardCreatorId !== this.state.userId) {
          this.props.history.push(`/forbidden`);
          return null;
        } else {
          this.deleteCard(this.state.cardId, this.state.credentials)
        .then((card) => {         
            this.setState({
              deletedCardOrError: card,
            })
            this.props.history.push(`/decks/` + this.state.deckId);
        }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
        })
      }
    })
    .catch(()=>{
        this.props.history.push('/error');
    })
  }


  deleteCard = async (cardId, credentials) => {    
    await this.state.deleteCard(cardId, credentials)
  }

  render() {
    return null
  }
}
