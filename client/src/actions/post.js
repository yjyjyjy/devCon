import axios from "axios";
import { DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./constants";

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
    console.log(err.response.status);
    console.log(err.response.statusText);
    dispatch({
      type: POST_ERROR,
      payload: { status: err.response.status, msg: err.response.statusText },
    });
  }
};

// delete post
export const deletePost = () => async dispatch => {
  try {
    console.log(DELETE_POST)
  } catch (err) {
    
  }
}