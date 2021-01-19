import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPostById } from "../../actions/post";
import { Link } from "react-router-dom";
import PostCommentItem from "./PostCommentItem";

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
        <div className="post-form">
          <div className="bg-primary p">
            <h3>Leave A Comment</h3>
          </div>
          <form className="form my-1">
            <textarea
              name="text"
              cols="30"
              rows="5"
              placeholder="Comment on this post"
              required
            ></textarea>
            <input type="submit" className="btn btn-dark my-1" value="Submit" />
          </form>
        </div>

        {/* comments */}
        {post.comments.map((comment) => (
          <PostCommentItem key={comment._id} comment={comment} />
        ))}
      </Fragment>
    )
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post.post,
});

export default connect(mapStateToProps, { getPostById })(Post);
