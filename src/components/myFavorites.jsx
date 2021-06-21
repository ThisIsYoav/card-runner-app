import React, { Component } from 'react';
import PageHeader from "./common/pageHeader";
import cardService from "../services/cardService";
import Card from "./card";
import Pagination from "./common/pagination";
import { Link } from "react-router-dom";
import axios from 'axios';

class MyFavorites extends Component {
    state = {
        cards: [],
        currentCards: [],
        amount: 0,
        totalCards: 0,
        totalPages: 0,
        currentPage: 1
    }

    pageNeighbours = 0;

    goToPage = page => {
        const { cards, totalPages } = this.state;
        const currentPage = Math.max(0, Math.min(page, totalPages));
        const offset = (currentPage - 1) * 9;
        const currentCards = cards.slice(offset, offset + 9);
        this.setState({ currentCards, currentPage });
    }

    handledInFavs = (likes, userId) => {
        let { amount } = this.state;
        if (likes.includes(userId)) {
            amount++;
        } else {
            amount--;
        }
        this.setState({ amount });
    }

    //signal is an axios handle to deny requests their resolve and execute the reject instead (i.e. when a user navigates out of a page before the state is set with the response data).
    signal = axios.CancelToken.source();

    componentWillUnmount() {
        this.signal.cancel('requests canceled.');
    }

    async componentDidMount() {
        try {
            const { data } = await cardService.getMyFavs(this.signal.token);
            const currentCards = data.slice(0, 9);
            const totalPages = Math.ceil(data.length / 9);
            if (data.length > 0) this.setState({ cards: data, currentCards, amount: data.length, totalPages, totalCards: data.length })
        } catch (ex) {
            if (axios.isCancel(ex)) return console.log(ex.message);
            const { history } = this.props;
            if (ex.response && ex.response.status === 400) history.replace('/');
        }
    }

    render() {
        const { cards, currentCards, amount, totalPages, currentPage } = this.state;
        const { user } = this.props;

        return (
            <div className="container">
                <PageHeader titleText="My Favorites" />
                <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-md-4">
                        <p>You have {amount} cards in your favorites.</p>
                    </div>
                    {totalPages > 1 && <React.Fragment>
                        <div className='col-12 col-sm-4'>
                            <Pagination totalPages={totalPages} currentPage={currentPage} pageNeighbours={this.pageNeighbours} goToPage={this.goToPage}></Pagination>
                        </div>
                        <div className='col-12 col-sm-4 text-right font-weight-light mb-3'>
                            <span> Page {currentPage} / {totalPages}</span>
                        </div>
                    </React.Fragment>
                    }
                </div>
                <div className="row">
                    {cards.length < 1 && (
                        <div className="col-md-6 col-lg-4 mt-3">
                            <span>
                                <Link to={'/cards/search?q='}>Click here </Link> to browse free!
                            </span>
                        </div>
                    )}
                    {cards.length > 0 &&
                        currentCards.map(card => <Card key={card._id} card={card} user={user} handledInFavs={this.handledInFavs} />)}
                </div>
                {totalPages > 1 && <div className="mt-3">
                    <Pagination totalPages={totalPages} currentPage={currentPage} pageNeighbours={1} goToPage={this.goToPage}></Pagination>
                </div>}
            </div>
        );
    }
}

export default MyFavorites;