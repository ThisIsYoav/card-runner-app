import React from "react";
import Form from "./common/form";
import PageHeader from "./common/pageHeader";
import cardService from "../services/cardService";
import { toast } from "react-toastify";

class DeleteCard extends Form {
  state = {};

  handleCancel = () => {
    this.props.history.push("/my-cards");
  };

  schema = {};

  // runs after handleSubmit from Form
  doSubmit = async () => {
    try {
      const cardId = this.props.match.params.id;
      await cardService.deleteCard(cardId);
      toast("Card has been deleted");
      this.props.history.replace("/my-cards");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) this.props.history.replace('/my-cards');
    }
  };

  render() {
    return (
      <div className="container">
        <PageHeader titleText="You're about to delete your card" />
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={this.handleSubmit} action="POST" autoComplete="off">
              {this.renderButton("Delete Card", "danger")}
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

export default DeleteCard;
