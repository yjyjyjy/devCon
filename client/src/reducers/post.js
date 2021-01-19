import {
  CREATE_POST,
  DELETE_POST,
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
        posts: [...state.posts, payload.createdPost],
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

    default:
      return state;
  }
}
