import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../configs";
import PaginationUser from "../../components/Pagination/pagination";
import { navigateId } from "../../utils/fn";
import "./Home.scss";

interface Post {
  id: number;
  title: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 10;

  const id = 123;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="new">Home</div>
      <Link
        to={navigateId(
          config.routes.detail,
          config.suffix.detailId,
          id.toString()
        )}
      >
        haha
      </Link>

      {currentPosts.map((post) => (
        <div key={post.id} style={{ display: "flex", gap: "2px" }}>
          <h3>{post.id}</h3>
          <h3>{post.title}</h3>
        </div>
      ))}

      <PaginationUser
        totalPosts={posts.length}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        sibling={2}
      />
    </>
  );
};

export default Home;
