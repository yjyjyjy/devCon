import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Landing from "./component/layout/Landing";
import "./App.css";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import Alert from "./component/layout/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./component/dashboard/Dashboard";
import PrivateRoute from "./component/routing/PrivateRoute";
import ProfileForm from "./component/profile-forms/ProfileForm";
import AddExperience from "./component/profile-forms/AddExperience";
import AddEducation from "./component/profile-forms/AddEducation";
import Profiles from "./component/profiles/Profiles";
import Profile from "./component/profile/Profile";
import Posts from "./component/posts/Posts";
import Post from "./component/posts/Post";
import PageNotFound from "./component/layout/PageNotFound";

// Redux
import { Provider } from "react-redux";
import store from "./store";

// check if there is a valid token in the local storage already. We can log user in if there is.
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <section className="container">
              <Alert />
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:userId" component={Profile} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/posts" component={Posts} />
                <PrivateRoute exact path="/post/:postId" component={Post} />
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={ProfileForm}
                />
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={ProfileForm}
                />
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}
                />
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}
                />
                <Route component={PageNotFound} />
              </Switch>
            </section>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
