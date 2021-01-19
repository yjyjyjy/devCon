import axios from "axios";
import {
  CREATE_POST,
  DELETE_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
} from "./constants";
import { setAlert } from "../actions/alert";

// Get Posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { status: err.response.status, msg: err.response.statusText },
    });
  }
};

// update likes
export const updateLikes = (postId, like = true) => async (dispatch) => {
  try {
    const res = await axios.put(
      `/api/posts/${like ? "like" : "unlike"}/${postId}`
    );
    const likes = res.data;
    dispatch({ type: UPDATE_LIKES, payload: { postId, likes } });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { status: err.response.status, msg: err.response.statusText },
    });
  }
};

// delete post
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    dispatch({ type: DELETE_POST, payload: { postId } });
    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { status: err.response.status, msg: err.response.statusText },
    });
  }
};

// create post
export const createPost = ({ text }) => async (dispatch) => {
  try {
    const res = await axios.post("/api/posts", { text });
    dispatch({ type: CREATE_POST, payload: { createdPost: res.data } });
    dispatch(setAlert("Post Created", "success"));
  } catch (err) {
    console.log(err);
    !!err.response &&
      dispatch({
        type: POST_ERROR,
        payload: { status: err.response.status, msg: err.response.statusText },
      });
  }
};
