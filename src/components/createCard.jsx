import React from "react";
import PageHeader from "./common/pageHeader";
import Form from "./common/form";
import Joi from "joi-browser";
import cardService from "../services/cardService";
import { toast } from "react-toastify";

class CreateCard extends Form {
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

	// runs after handleSubmit from Form
	doSubmit = async () => {
		const data = { ...this.state.data };
		if (!data.bizImage) delete data.bizImage;
		await cardService.createCard(data);
		toast("Your new card has been created!");
		this.props.history.replace("/my-cards");
	};

	render() {
		return (
			<div className="container">
				<PageHeader titleText="Business Registration" />
				<div className="row">
					<div className="col-12">
						<p>Create a new Businesss Card</p>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6">
						<form onSubmit={this.handleSubmit} action="POST" autoComplete="off">
							{this.renderInput("bizName", "Business Name")}
							{this.renderInput("bizDescription", "Business Description")}
							{this.renderInput("bizAddress", "Business Address")}
							{this.renderInput("bizPhone", "Business Phone (Israeli number)", "tel")}
							{this.renderInput("bizImage", "Business Image (URL, leave empty for a default)")}
							{this.renderButton("Create Card")}
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default CreateCard;
