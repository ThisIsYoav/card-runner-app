import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import cardService from '../services/cardService';
import Card from './card';
import axios from 'axios';

class Home extends Component {
  state = {
    cards: []
  };
//signal is an axios handle to deny requests their resolve and execute the reject instead (i.e. when a user navigates out of a page before the state is set with the response data).
  signal = axios.CancelToken.source();

  componentWillUnmount() {
    this.signal.cancel('requests canceled');
  }
  
  async componentDidMount() {
    try {
      const { data } = await cardService.getTopCards(this.signal.token);
      this.setState({ cards: data });
    } catch (ex) {
      if (axios.isCancel(ex)) return console.log(ex.message);
    }
  }

  render() {
    const { cards } = this.state;
    const { user } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <PageHeader titleText="CardRunner" />
            <p>
              CardRunner is a platform for searching and managing
              business cards.
            </p>
              <h4 className='text-center font-weight-light'>
              Our Top Cards
              </h4>
          </div>
        </div>
        <div className="row">
        {cards.length > 0 &&
            cards.map((card) => <Card key={card._id} card={card} user={user} />)}
        </div>
      </div>
    );
  }
}

export default Home;
