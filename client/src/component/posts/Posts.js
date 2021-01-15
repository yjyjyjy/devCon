import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => getPosts(), [getPosts]);

  return !loading && !!posts ? (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome to the community
      </p>
      {/*Post Form*/}
      <div className="posts">
        {posts.map((p) => (
          <PostItem key={p._id} post={p} />
        ))}
      </div>
    </Fragment>
  ) : (
    <Spinner />
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapstateToProps = (state) => ({
  post: state.post,
});
export default connect(mapstateToProps, { getPosts })(Posts);
