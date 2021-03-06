import React from "react";
import Form from "./common/form";
import PageHeader from "./common/pageHeader";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";

class Signin extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {}
  };

  // set the Joi validation schema
  schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(6)
      .label("Password")
  };

  // runs after handleSubmit from Form
  doSubmit = async () => {
    const { email, password } = this.state.data;
    try {
      await userService.login(email, password);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ errors: { email: ex.response.data } });
      }
    }
  };

  render() {
    if (userService.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div className="container">
        <PageHeader titleText="Signin to CardRunner" />
        <div className="row">
          <div className="col-12">
            <p>Log in to your account and use the app's full set of features! </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={this.handleSubmit} method="POST" autoComplete="off">
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Signin")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;