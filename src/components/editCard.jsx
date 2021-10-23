import React from "react";
import Form from "./common/form";
import PageHeader from "./common/pageHeader";
import Joi from "joi-browser";
import cardService from "../services/cardService";
import { toast } from "react-toastify";
import axios from 'axios';

class EditCard extends Form {
	state = {
		data: {
			bizName: "",
			bizDescription: "",
			bizAddress: "",
			bizPhone: "",
			bizImage: "",
		},
		errors: {},
	};

	// set the Joi validation schema
	schema = {
		_id: Joi.string(),
		bizName: Joi.string().min(2).max(255).required(),
		bizDescription: Joi.string().min(2).max(1024).required(),
		bizAddress: Joi.string().min(2).max(400).required(),
		bizPhone: Joi.string()
			.min(9)
			.max(10)
			.required()
			.regex(/^0[2-9]\d{7,8}$/),
		bizImage: Joi.string().min(11).max(1024).uri().allow(""),
	};

	//signal is an axios handle to deny requests their resolve and execute the reject instead (i.e. when a user navigates out of a page before the state is set with the response data).
	signal = axios.CancelToken.source();

	componentWillUnmount() {
		this.signal.cancel('requests canceled');
	}

	async componentDidMount() {
		const cardId = this.props.match.params.id;
		try {
			const { data } = await cardService.getCard(cardId, this.signal.token);
			this.setState({ data: this.mapToViewModel(data) });
		} catch (ex) {
			if (axios.isCancel(ex)) return console.log(ex.message);
			if (ex.response && ex.response.status === 404) this.props.history.replace('/my-cards');
		}
	}

	mapToViewModel(card) {
		return {
			_id: card._id,
			bizName: card.bizName,
			bizDescription: card.bizDescription,
			bizAddress: card.bizAddress,
			bizPhone: card.bizPhone,
			bizImage: card.bizImage,
		};
	}

	handleCancel = () => {
		this.props.history.push("/my-cards");
	};

	// runs after handleSubmit from Form
	doSubmit = async () => {
		try {
			const { data } = this.state;
			await cardService.editCard(data);
			toast("Card has been updated");
			this.props.history.replace("/my-cards");
		} catch (ex) {
			if (ex.response && ex.response.status === 404) this.props.history.replace('/my-cards');
		}
	};

	render() {
		return (
			<div className="container">
				<PageHeader titleText="Edit Card Form" />
				<div className="row">
					<div className="col-12">
						<p>Edit your card</p>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6">
						<form onSubmit={this.handleSubmit} action="POST" autoComplete="off">
							{this.renderInput("bizName", "Business Name")}
							{this.renderInput("bizDescription", "Business Description")}
							{this.renderInput("bizAddress", "Business Address")}
							{this.renderInput("bizPhone", "Business Phone (Israeli number)", 'tel')}
							{this.renderInput("bizImage", "Business Image (URL, leave empty for a default)")}
							{this.renderButton("Update Card")}
							<button
								onClick={this.handleCancel}
								className="btn btn-secondary ml-2"
							>
								Cancel
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default EditCard;
