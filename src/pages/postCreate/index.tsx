import { FC, ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../../utils/useTitle";
import { postAddUrl } from "../../utils/baseApi";
import { dateForm } from "../../utils/date";
import "./index.css";
interface post {
  postId?: string | undefined;
  postTitle?: string | undefined;
  posterId?: string | undefined;
  postBody?: string | undefined;
  postTime?: string | undefined;
}
const PostCreate: FC = (): ReactElement => {
  const [post, setPost] = useState<post>();
  const buttonTitle = ["提交", "返回"];
  const navigate = useNavigate();
  useTitle("创建帖子");
  const submitEdit = async () => {
    fetch(postAddUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ ...post, postTime: dateForm() }),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          alert("创建成功");
          window.location.reload();
          navigate("/post", { replace: true });
        }
      })
      .catch((res) => {
        alert("检查网络后重试");
      });
  };
  const cancelEdit = () => {
    navigate("/post");
  };
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, postTitle: e.target.value });
  };
  const handleBody = (e: any) => {
    setPost({ ...post, postBody: e.target.value });
  };

  return (
    <div className="user">
      <div>新建帖子</div>
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
export default PostCreate;
