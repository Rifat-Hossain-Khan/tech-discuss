import path from "@/path";
import { redirect } from "next/navigation";
import PostList from "@/components/posts/post-list";
import { fetchPostsBySearchTerm } from "@/db/queries/posts";

interface SearchPageProps {
  searchParams: {
    term: string;
  };
}

function Search({ searchParams }: SearchPageProps) {
  const { term } = searchParams;

  if (!term) {
    redirect(path.home());
  }
  return (
    <div>
      <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
    </div>
  );
}

export default Search;
