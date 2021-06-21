import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import cardService from "../services/cardService";
import Pagination from "./common/pagination";
import Card from "./card";
import { Link } from "react-router-dom";
import axios from 'axios';

class MyCards extends Component {
  state = {
    cards: [],
    currentCards: [],
    totalCards: 0,
    totalPages: 0,
    currentPage: 1
    }

    //pageNeighbours is how many additional blocks will be on paginations each side
    pageNeighbours = 0

    goToPage = page => {
        const { cards, totalPages } = this.state;
        const currentPage = Math.max(0, Math.min(page, totalPages));
        const offset = (currentPage - 1) * 9;
        const currentCards = cards.slice(offset, offset + 9);
        this.setState({ currentCards, currentPage });
    }

  //signal is an axios handle to deny requests their resolve and execute the reject instead (i.e. when a user navigates out of a page before the state is set with the response data).
    signal = axios.CancelToken.source();

  componentWillUnmount() {
    this.signal.cancel('requests canceled');
  }
  
  async componentDidMount() {
    try {
      const { data } = await cardService.getMyCards(this.signal.token);
      const currentCards = data.slice(0, 9);
      const totalPages = Math.ceil(data.length / 9);
      if (data.length > 0) this.setState({ cards: data, currentCards, totalPages, totalCards: data.length });
    } catch (ex) {
      if (axios.isCancel(ex)) return console.log(ex.message);
    }
  }

  render() {
    const { cards, currentCards, totalPages, currentPage } = this.state;
    const { user } = this.props;

    return (
      <div className="container">
        <PageHeader titleText="My Cards" />
        <div className="row align-items-center">
          <div className="col-12 mb-2">
            <Link className="btn btn-primary " to="/create-card">
              Add New Card
            </Link>
          </div>
          <div className="col-12 col-md-4">
            <p>Your {cards.length} cards in the list below</p>
          </div>
          {totalPages > 1 && <React.Fragment>
               <div className='col-12 col-md-4'>
            <Pagination totalPages={totalPages} currentPage={currentPage} pageNeighbours={this.pageNeighbours} goToPage={this.goToPage}></Pagination>
          </div>
            <div className='col-12 col-md-4 text-right font-weight-light mb-3'>
            <span> Page {currentPage} / {totalPages}</span>
            </div>
            </React.Fragment>
          }
        </div>
        <div className="row">
          {cards.length > 0 &&
            currentCards.map((card) => <Card key={card._id} card={card} user={user} />)}
        </div>
        { totalPages > 1 && <div className="mt-3">
        <Pagination totalPages={totalPages} currentPage={currentPage} pageNeighbours={1} goToPage={this.goToPage}></Pagination>
        </div>}
      </div>
    );
  }
}

export default MyCards;
