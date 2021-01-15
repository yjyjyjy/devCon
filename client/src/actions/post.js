import axios from "axios";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./constants";

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
    await axios.put(`/api/posts/${like ? "like" : "unlike"}/${postId}`);
    const res = await axios.get("/api/posts");
    dispatch({ type: UPDATE_LIKES, payload: res.data });
  } catch (err) {
    console.log(err.response.status);
    console.log(err.response.statusText);
    dispatch({
      type: POST_ERROR,
      payload: { status: err.response.status, msg: err.response.statusText },
    });
  }
};
