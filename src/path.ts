import { search } from "@/actions";
const path = {
  home: () => "/",
  topicShow: (topicSlug: string) => `/topics/${topicSlug}/`,
  postCreate: (topicSlug: string) => `/topics/${topicSlug}/post/new`,
  postShow: (topicSlug: string, postId: string) =>
    `/topics/${topicSlug}/posts/${postId}`,
  search: (term: string) => `/search?term=${term}`,
};

export default path;
