import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import cardService from "../services/cardService";
import axios from 'axios';

class Card extends Component {
	state = {
		card: {},
		likeMessage: '',
		btnClass: 'btn btn-sm btn-primary'
	}

	buttonClass(likes, userId) {
		let classes = "btn btn-sm ";
		classes += likes.includes(userId) ? "btn-secondary" : "btn-info";
		return classes;
	}

	likeAmount(amount) {
		let likeMessage = amount;
		if (amount > 1) { likeMessage += ' people like this!' }
		else if (amount === 1) { likeMessage += ' person likes this!' }
		else { likeMessage = 'Be the first to like this!' }
		return likeMessage;
	}

	handleLike = async cardId => {
		try {
			const { data } = await cardService.toggleFav({ cardId }, this.signal.token);
			const card = data.card;
			const { handledInFavs, user } = this.props;
			if (card && handledInFavs) handledInFavs(card.likedBy, user._id);

			const likeMessage = this.likeAmount(card.likedBy.length);
			const btnClass = this.buttonClass(card.likedBy, user._id);
			this.setState({ card, likeMessage, btnClass });
			card.likedBy.includes(user._id) ? toast.info(`"${card.bizName}" added to favorites`) : toast.info(`"${card.bizName}" removed from favorites.`)
		}
		catch (ex) {
			if (axios.isCancel(ex)) return console.log(ex.message);
			if (ex.response && ex.response.status === 400) toast.error('Could not handle like');
		}
	}

	//signal is an axios handle to deny requests their resolve and execute the reject instead (i.e. when a user navigates out of a page before the state is set with the response data).
	signal = axios.CancelToken.source();

	componentWillUnmount() {
		this.signal.cancel('requests canceled');
	}

	componentDidMount() {
		const { card, user } = this.props;
		const likeMessage = this.likeAmount(card.likedBy.length);
		let btnClass = '';
		if (user) btnClass = this.buttonClass(card.likedBy, user._id);
		this.setState({ card, likeMessage, btnClass })
	}

	render() {
		const { card, likeMessage, btnClass } = this.state;
		const { user } = this.props;
		return (
			<div className="col-md-6 col-lg-4 pt-2 pb-1">
				<div className="card h-100">
					<div className="card-image p-2 pb-0 d-flex justify-content-center">
						<img
							className='rounded'
							src={card.bizImage}
							alt={card.bizName}
						/>
					</div>
					<div className="card-body pt-2">
						<h5 className="card-title">{card.bizName}</h5>
						<p onClick={() => { alert(card.bizDescription) }} className="card-text text-truncate">{card.bizDescription}</p>
						<p className="card-text border-top pt-2">
							<b>Tel: </b>
							{card.bizPhone}
							<br />
							{card.bizAddress}
						</p>
					</div>
					<div className='card-footer'>
						<span>
							{likeMessage}
						</span>
						<span className="float-right">
							{user && user._id !== card.user_id &&
								<button
									onClick={() => this.handleLike(card._id)}
									className={btnClass}
								>
									Bookmark
								</button>
							}
							{user && user._id === card.user_id &&
								<React.Fragment>
									<Link to={`/my-cards/edit/${card._id}`}>Edit</Link> |
									<Link className="ml-2" to={`/my-cards/delete/${card._id}`}>
										Delete
									</Link>
								</React.Fragment>}
						</span>
					</div>
				</div>
			</div>
		)
	};
};

export default Card;