import React, { useState } from "react";
import PropTypes from "prop-types";
import { createPost } from "../../actions/post";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const CreatePost = ({ createPost }) => {
  const formInitState = { text: "" };
  const [formData, setFormData] = useState(formInitState);
  const { text } = formData;
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          createPost(formData);
          setFormData(formInitState);
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={(e) => onChangeHandler(e)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired,
};

export default connect(null, { createPost })(CreatePost);
