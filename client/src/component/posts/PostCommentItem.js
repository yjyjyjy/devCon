import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";

const PostCommentItem = ({
  comment: { _id, avatar, date, name, text, user },
  authUser,
}) => {
  return (
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
          <button type="button" className="btn btn-danger">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostCommentItem.propTypes = { comment: PropTypes.object.isRequired };

const mapStateToProps = (state) => ({
  authUser: state.auth.user,
});

export default connect(mapStateToProps)(PostCommentItem);
