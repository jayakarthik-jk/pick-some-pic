import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Like from "./Like";
import Download from "./Download";
import UserAvatar from "./UserAvatar";
import RelatedPosts from "../RelatedPosts";
import Placeholder from "./Placeholder";
import Error from "./Error";

import useColor from "./../../hooks/useColor";
import { getPost } from "../../services/PostService";

function Post(props) {
  const { BRAND_COLOR } = useColor();
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const temp = await getPost(id);
        if (temp) {
          setPost(temp);
          window.scrollTo(0, 0);
        } else {
          navigate("/not-found", { replace: true });
        }
      } catch (error) {
        setError(true);
      }
    })();
  }, [id, navigate]);
  if (Object.keys(post).length <= 0) <Placeholder />;

  if (error) {
    return <Error />;
  }

  const { likes, liked_by_user } = post;
  const name = post?.user?.name;
  const username = post?.user?.username;
  const user_profile_image = post?.user?.profile_image?.thumb;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div
            className={`col-12 col-md-7 col-lg-8 col-xl-9  border-end border-bottom border-${BRAND_COLOR}`}
            style={{
              display: "flex",
              justifyContent: "center",
              minHeight: "90vh",
            }}
          >
            <img
              src={post?.urls?.regular ? post?.urls?.regular : post?.urls?.raw}
              alt=""
              className=" my-3"
              loading="lazy"
              style={{ maxHeight: "80vh" }}
            />
          </div>
          <div
            className={`col-12 col-md-5 col-lg-4 col-xl-3 border-bottom border-${BRAND_COLOR}`}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div className="p-2 pt-5 d-flex" style={{ flexDirection: "row" }}>
              <UserAvatar name={name} img={user_profile_image} />
              <Like id={id} liked_by_user={liked_by_user} likes={likes} />
            </div>

            <div className="py-3">
              <Download urls={post.urls} />
            </div>
          </div>
        </div>
      </div>
      <RelatedPosts username={username} />
    </>
  );
}

export default Post;