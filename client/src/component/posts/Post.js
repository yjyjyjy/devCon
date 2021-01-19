import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPostById } from "../../actions/post";
import { Link } from "react-router-dom";

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
        <div class="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${post.user}`}>
              <img class="round-img" src={post.avatar} alt="" />
              <h4>{post.name}</h4>
            </Link>
          </div>
          <div>
            <p class="my-1">{post.text}</p>
          </div>
        </div>

        {/* comment Form */}
        <div class="post-form">
          <div class="bg-primary p">
            <h3>Leave A Comment</h3>
          </div>
          <form class="form my-1">
            <textarea
              name="text"
              cols="30"
              rows="5"
              placeholder="Comment on this post"
              required
            ></textarea>
            <input type="submit" class="btn btn-dark my-1" value="Submit" />
          </form>
        </div>

        {/* comments */}
        <div class="post bg-white p-1 my-1">
          <div>
            <a href="profile.html">
              <img
                class="round-img"
                src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                alt=""
              />
              <h4>John Doe</h4>
            </a>
          </div>
          <div>
            <p class="my-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
              possimus corporis sunt necessitatibus! Minus nesciunt soluta
              suscipit nobis. Amet accusamus distinctio cupiditate blanditiis
              dolor? Illo perferendis eveniet cum cupiditate aliquam?
            </p>
            <p class="post-date">Posted on 04/16/2019</p>
            <button type="button" class="btn btn-danger">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
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
