import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import { apiUrl } from "../config.json";
import PageHeader from "./common/pageHeader";
import Form from "./common/form";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";

class Signup extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: ""
    },
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
      .label("Password"),
    name: Joi.string()
      .required()
      .min(2)
      .label("Name")
  };

  // runs after handleSubmit from Form
  doSubmit = async () => {
    const data = { ...this.state.data };
    data.biz = false;
    try {
      await http.post(`${apiUrl}/users`, data);
      toast("Your account has been opened.");
      this.props.history.replace("/signin");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const { errors } = this.state;
        errors.email = "Email is already taken";
        this.setState({ errors });
      }
    }
  };

  render() {
    if (userService.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div className="container">
        <PageHeader titleText="Signup now!" />
        <div className="row">
          <div className="col-12">
            <p>Open a new account for free! </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={this.handleSubmit} action="POST" autoComplete="off">
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderInput("name", "Name")}
              {this.renderButton("Signup")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
