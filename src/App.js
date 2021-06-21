import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Browse from "./components/browse";
import About from "./components/about";
import Footer from "./components/footer";
import Signup from "./components/signup";
import BizSignup from "./components/bizSignup";
import Signin from "./components/signin";
import CreateCard from "./components/createCard";
import MyFavorites from "./components/myFavorites";
import MyCards from "./components/myCards";
import EditCard from "./components/editCard";
import DeleteCard from "./components/deleteCard";
import Logout from "./components/logout";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userService from "./services/userService";
import ProtectedRoute from "./components/common/protectedRoute";
import DeleteUser from "./components/deleteUser";

class App extends Component {
  state = { query: "" };

  // search query handler between Search and Browse 
  handleChange = (query) => {
    this.setState({ query });
  };

  componentDidMount() {
    const user = userService.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user, query } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <header>
          <Navbar
            user={user}
            query={query}
            handleChange={(query) => this.handleChange(query)}
          />
        </header>
        <main>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/cards/search" render={(props) => <Browse {...props} query={query} user={user} />}/>
            <ProtectedRoute
              path="/my-cards/edit/:id"
              component={EditCard}
              biz={true}
            />
            <ProtectedRoute
              path="/my-cards/delete/:id"
              component={DeleteCard}
              biz={true}
            />
            <ProtectedRoute path="/my-favorites" component={MyFavorites} biz={false} user={user} />
            <ProtectedRoute path="/my-cards" component={MyCards} biz={true} user={user} />
            <ProtectedRoute
              path="/create-card"
              component={CreateCard}
              biz={true}
            />
            <Route path="/biz-signup" component={BizSignup} />
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route path="/Logout" component={Logout} />
            <ProtectedRoute path="/delete-user" component={DeleteUser} biz={false} />
            <Route path="/" exact render={()=> <Home user={user}/>} />
          </Switch>
        </main>
        <footer className="mt-3">
          <Footer />
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
