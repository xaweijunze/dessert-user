import { FC, ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import useTitle from "../../utils/useTitle";
import { postEditUrl, postByIdUrl } from "../../utils/baseApi";
import "./index.css";
interface post {
  postId?: string | undefined;
  postTitle?: string | undefined;
  postBody?: string | undefined;
}
const PostEdit: FC = (): ReactElement => {
  const [post, setPost] = useState<post>();
  const buttonTitle = ["提交", "返回"];
  const params = useParams();
  const navigate = useNavigate();
  useTitle("更新帖子");
  useEffect(() => {
    fetch(postByIdUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: params.id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          const { postBody, postId, postTitle } = data;
          setPost({ postBody, postId, postTitle });
        }
      })
      .catch((res) => {
      });
  }, [params]);
  const submitEdit = async () => {
    fetch(postEditUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(post),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          alert("更新成功");
          navigate("/postuser", { replace: true });
        }
      })
      .catch((res) => {
        alert("检查网络后重试");
      });
  };
  const cancelEdit = () => {
    navigate("/postuser");
  };
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, postTitle: e.target.value });
  };
  const handleBody = (e: any) => {
    setPost({ ...post, postBody: e.target.value });
  };

  return (
    <div className="user">
      <div>更新帖子</div>
      <div className="edit-from">
        <div className=" my-item">
          <span>标题： </span>
          <input
            type="text"
            onChange={handleTitle}
            value={post?.postTitle}
            disabled={false}
          />
        </div>
        <div className="my-item">
          <span>正文： </span>
          <textarea
            onChange={handleBody}
            value={post?.postBody}
            disabled={false}
          />
        </div>
      </div>
      <div className="edit-button">
        <button onClick={submitEdit} style={{ backgroundColor: "red" }}>
          {buttonTitle[0]}
        </button>
        <button onClick={cancelEdit} style={{ backgroundColor: "red" }}>
          {buttonTitle[1]}
        </button>
      </div>
    </div>
  );
};
export default PostEdit;
