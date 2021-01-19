import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { deletePostComment } from "../../actions/post";

const PostCommentItem = ({
  comment: { _id, avatar, date, name, text, user },
  postId,
  authUser,
  loading,
  deletePostComment,
}) => {
  return !loading && !!authUser ? (
    <div className="post bg-white p-1 my-1">
      <div>
        <a href="profile.html">
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </a>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="MM/DD/YYYY">{date}</Moment>
        </p>
        {user === authUser._id && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => deletePostComment({ postId, postCommentId: _id })}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

PostCommentItem.propTypes = { comment: PropTypes.object.isRequired };

const mapStateToProps = (state) => ({
  authUser: state.auth.user,
  loading: state.post.loading && state.auth.loading,
  deletePostComment: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { deletePostComment })(PostCommentItem);
