import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import OrderBy from "./common/orderBy";
import Pagination from "./common/pagination";
import cardService from "../services/cardService";
import Card from "./card";
import qs from 'querystring';
import axios from 'axios'

class Browse extends Component {
  state = {
    cards: [],
    totalCards: 0,
    totalPages: 0,
    currentPage: 1,
    sortBy: 'Most Popular'
  };

  /* queryTrigger with onChangeHistory() identify if there is a change in location (e.g. user navigated back\forth),
  in which case the search query in componentDidUpdate will be the current location.
  timerId is a setTimeout between user text inputs on Search component (to prevent a request flood).
  pageNeighbours is how many additional blocks will be on paginations each side. */
  timerId;
  queryTrigger;
  pageNeighbours = 0
  sortOptions = ['Most Popular', 'Name', 'Newest', 'Oldest'];

  onChangeHistory = () => {
    this.queryTrigger = true;
  }

  sort = sortBy => {
    const order = sortBy.toLowerCase();
    const { query } = this.props;
    const search = `?q=${query}&p=1&o=${order}`;
    this.setState({ sortBy })
    this.props.history.replace({ search });
  }

  goToPage = page => {
    const currentPage = Math.max(0, Math.min(page, this.state.totalPages));
    const { query } = this.props;
    const search = `?q=${query}&p=${currentPage}&o=${this.state.sortBy.toLowerCase()}`;
      this.setState({ currentPage });
      this.props.history.replace({ search });
  }
  
  //signal is an axios handle to deny requests their resolve and execute the reject instead (i.e. when a user navigates out of a page before the state is set with the response data).
  signal = axios.CancelToken.source();

  componentWillUnmount() {
    clearTimeout(this.timerId);
    this.signal.cancel('requests canceled.');
    window.removeEventListener('popstate', this.onChangeHistory);
}
  
  async componentDidUpdate(prevProps) {
    clearTimeout(this.timerId);
    const { query, location } = this.props;
    
    if (query === prevProps.query && location.search === prevProps.location.search) return;
    
    this.timerId = setTimeout( async () => {
      let { currentPage, sortBy } = this.state;
      const order = sortBy.toLowerCase();
      let search = this.queryTrigger ? location.search : `?q=${query}&p=${currentPage}&o=${order}`;
      this.queryTrigger = false;

      try {
        const { data } = await cardService.searchCards(search, this.signal.token);
        const totalPages = Math.ceil(data.total / 9);
        //if current page is higher than the total number of pages, reset the url 'p' query to 1
        if (currentPage > totalPages) {
          search = `?q=${query}&p=1&o=${order}`;
          currentPage = 1;
        }
        this.props.history.replace({ search });
        this.setState({ cards: data.cards, totalCards: data.total, totalPages, currentPage });
      } catch (ex) {
        if (axios.isCancel(ex)) return console.log(ex.message);
      }
    }, 500);
  }

  async componentDidMount() {
    const { location } = this.props;
    window.addEventListener('popstate', this.onChangeHistory);
    try {
      const { data } = await cardService.searchCards(this.props.location.search, this.signal.token);
      const totalPages = Math.ceil(data.total / 9);
      // set current page to urls 'p' query, default to 1st page
      const parsedQuery = qs.parse(location.search);
      const currentPage = parsedQuery.p ? parseInt(parsedQuery.p) : 1;
      const sortBy = parsedQuery.o ? parsedQuery.o : 'Most Popular';
      if (data.total > 0) this.setState({ cards: data.cards, totalCards: data.total, totalPages, currentPage, sortBy });
    } catch (ex) {
      if (axios.isCancel(ex)) return console.log(ex.message);
    }
  }

  render() {
    const { cards, totalPages, currentPage, sortBy, totalCards } = this.state;
    const { user } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <PageHeader titleText="Card Browser" />
            <p className=''>Browse free or { !user && 'sign in to'} use the live search above </p>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-sm-4'>
          {totalCards > 0 && <p className='mt-2 font-weight-light'>Showing <span className='badge badge-pill badge-info'>{totalCards}</span> results{totalPages > 1 && <span> | Page {currentPage} / {totalPages}</span>}</p>}
          </div>
          {totalPages > 1 && 
          <React.Fragment>
          <div className='col-12 col-sm-4'>
            <Pagination totalPages={totalPages} currentPage={currentPage} pageNeighbours={this.pageNeighbours} goToPage={this.goToPage}></Pagination>
          </div>
          <div className='col-12 text-right col-sm-4 font-weight-light mt-1'>
          <OrderBy sortOptions={this.sortOptions} sortBy={sortBy} sort={this.sort}></OrderBy>
          </div>
          </React.Fragment>
          }
        </div>
        <div className="row">
          {cards.length < 1 && (
            <div className="col-md-6 col-lg-4 mt-3">
              <span>No cards matched.</span>
            </div>
          )}
          {cards.length > 0 &&
            cards.map((card) => <Card key={card._id} card={card} user={user}/>)}
        </div>
        { totalPages > 1 && <div className="mt-3">
        <Pagination totalPages={totalPages} currentPage={currentPage} pageNeighbours={1} goToPage={this.goToPage}></Pagination>
        </div>}
      </div>
    );
  }
}

export default Browse;
