import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPostById } from "../../actions/post";
import { Link } from "react-router-dom";
import PostCommentItem from "./PostCommentItem";
import CreatePostComment from "./CreatePostComment";

const Post = ({
  match: {
    params: { postId },
  },
  getPostById,
  post,
}) => {
  useEffect(() => getPostById(postId), [getPostById, postId]);
  return (
    !!post && (
      <Fragment>
        <div className="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${post.user}`}>
              <img className="round-img" src={post.avatar} alt="" />
              <h4>{post.name}</h4>
            </Link>
          </div>
          <div>
            <p className="my-1">{post.text}</p>
          </div>
        </div>

        {/* comment Form */}
        <CreatePostComment postId={postId} />

        {/* comments */}
        {post.comments
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map((comment) => (
            <PostCommentItem key={comment._id} comment={comment} />
          ))}
      </Fragment>
    )
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post.post,
});

export default connect(mapStateToProps, { getPostById })(Post);
