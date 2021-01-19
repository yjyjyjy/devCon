import { post } from "request";
import {
  CREATE_POST,
  CREATE_POST_COMMENT,
  DELETE_POST,
  DELETE_POST_COMMENT,
  GET_POSTS,
  GET_POST_BY_ID,
  POST_ERROR,
  UPDATE_LIKES,
} from "../actions/constants";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST_BY_ID:
      return {
        ...state,
        post: payload.post,
        loading: false,
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [payload.createdPost, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload.postId),
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    case CREATE_POST_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [payload.createdComment, ...state.post.comments],
        },
        loading: false,
      };
    case DELETE_POST_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: payload.remainingPostComments,
        },
        loading: false,
      };
    default:
      return state;
  }
}
