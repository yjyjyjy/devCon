import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";

const Posts = ({ getPosts }) => {
  useEffect(() => getPosts(), [getPosts]);
  return <Fragment>Faggot</Fragment>;
  // return !loading && !!posts ? <Fragment></Fragment> : <Spinner />;
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapstateToProps = (state) => ({
  post: state.post,
});
export default connect(mapstateToProps, { getPosts })(Posts);
