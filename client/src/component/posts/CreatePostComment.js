import React, { useState } from "react";
import PropTypes from "prop-types";
import { STATES } from "mongoose";

const CreatePostComment = ({ postId }) => {
  const formDataInitState = { text: "" };
  const [formData, setFormData] = useState(formDataInitState);
  const { text } = formData;
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Leave A Comment</h3>
      </div>
      <div>{postId}</div>
      <form
        className="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          setFormData(formDataInitState);
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Comment on this post"
          value={text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CreatePostComment.propTypes = {};

export default CreatePostComment;
