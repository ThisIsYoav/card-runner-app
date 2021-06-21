import React from 'react';
import Form from "./common/form";
import PageHeader from "./common/pageHeader";
import Joi from "joi-browser";
import userService from "../services/userService";

class DeleteUser extends Form {
  state = {
    data: { password: "" },
    errors: {}
  }

  // set the Joi validation schema
  schema = {
    password: Joi.string()
      .required()
      .min(6)
      .label("Password")
  };

  // runs after handleSubmit from Form
  doSubmit = async () => {
    const { password } = this.state.data;
    try {
      await userService.deleteUser(password);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ data: { password: '' }, errors: { password: 'Invalid user or password.' } });
      }
    }
  };

  render() {
    return (
      <div className="container">
        <PageHeader titleText="You are about to delete your user" />
        <p className="text-danger">If you proceed, any cards or favorites you own will be lost.</p>
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={this.handleSubmit} method="POST" autoComplete="off">
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Delete")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteUser;