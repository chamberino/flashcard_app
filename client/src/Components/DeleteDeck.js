import { Component } from 'react';

export default class DeleteDeckWithContext extends Component {

    constructor(props) {
    super(props);
    this.state= { 
    deleteDeck: props.context.actions.deleteDeck, 
    props: props,  
    deckId: props.match.params.id,  
    userId: props.context.authenticatedUser.user.user.id,
    credentials: props.context.authenticatedUser.user.token
    }
  }

  componentDidMount() {      
    // Make a DELETE request to the API and return user to the list of decks.

    this.props.context.actions.getDeck(this.state.deckId)
      .then((deck)=>{
        this.setState({
            error: deck,
          })
        if (deck.errorStatus || deck.message) {
            this.props.history.push(`/notfound`);
            return null
          } else {
          this.setState({
              //program gets to this line
            deckCreatorId: deck.deck.user._id,
            foundDeck: true,
          })
        }
      }).then(()=>{
        if (!this.state.foundDeck) {
            //program gets here
          this.props.history.push(`/notfound`);
        }
        else if (this.state.deckCreatorId !== this.state.userId) {
            //program gets here
          this.props.history.push(`/forbidden`);
          return null;
        } else {
          this.deleteDeck(this.state.deckId, this.state.credentials)
        .then((deck) => {            
            this.setState({
              deletedDeckOrError: deck,
            })
          this.props.history.push('/');
        }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
        })
      }
    })

    // .catch(()=>{
    //     this.props.history.push('/error');
    // })
  }
  

  deleteDeck = async (deckId, credentials) => {    
    await this.state.deleteDeck(deckId, credentials)
  }

  render() {
    return null
  }
}
