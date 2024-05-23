import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import config from "../../configs";
// import PaginationUser from "../../components/Pagination/pagination";
// import { navigateId } from "../../utils/fn";
import "./Home.scss";
import Fancybox from "../../components/fancy-box-slide/FancyBox";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";

interface Post {
  id: number;
  title: string;
  thumbnail: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fileImage, setFileImage] = useState<File>();
  const [image, setImage] = useState<string>();
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const postsPerPage = 10;

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const response = await fetch(
  //       "https://jsonplaceholder.typicode.com/posts"
  //     );
  //     const data = await response.json();
  //     setPosts(data);
  //   };

  //   fetchPosts();
  // }, []);

  useEffect(() => {
    fetch(
      "https://dummyjson.com/products?limit=10&skip=10&select=title,thumbnail"
    )
      .then((res) => res.json())
      .then((response) => setPosts(response.products));
  }, []);

  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };
  const onNewChage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFileImage(file);
    }
  };
  const handleTofirebase = async () => {
    console.log("aa");

    if (fileImage) {
      console.log(fileImage);

      const img = await uploadImageToFirebase(fileImage);
      console.log(typeof img);
      if (typeof img === "string") {
        setImage(img);
      }
    }
    return;
  };

  return (
    <>
      {/* <div className="new">Home</div>
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
      /> */}

      <div>
        <Fancybox
          options={{
            Carousel: {
              infinite: true,
            },
            Images: {
              zoom: true,
            },
          }}
        >
          {posts?.map((post) => (
            <a data-fancybox="gallery" href={post.thumbnail} key={post.id}>
              <img alt="" src={post.thumbnail} width="200" height="150" />
            </a>
          ))}
        </Fancybox>
      </div>

      {image && <img src={image} />}
      <input type="file" onChange={(e) => onNewChage(e)} />
      <button onClick={() => handleTofirebase()}>Summit image</button>
    </>
  );
};

export default Home;
