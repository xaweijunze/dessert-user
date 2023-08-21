import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/nav";
import {
  postListUrl,
  userListUserUrl,
  postReviewAddUrl,
} from "../../utils/baseApi";
import useTitle from "../../utils/useTitle";
import "./index.css";
import useFetch from "../../utils/useFetch";
import Comment from "./Comment";
import { Popup } from "antd-mobile";
import { dateForm } from "../../utils/date";

const Post: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(-1);
  const [visible2, setVisible2] = useState(false);
  const [review, setReview] = useState("");
  const userId = localStorage.getItem("userId")||'';
  const [tagPost, setTagPost] = useState(0);
  useTitle("帖子列表");
  const {
    data: postListRes,
    error,
    loading,
  } = useFetch<any>(postListUrl, {
    header: {
      "x-access-token": localStorage.getItem("token"),
    },
  });
  const {
    data: userListRes,
    error: error2,
    loading: loading2,
  } = useFetch<any>(userListUserUrl);
  const userList = useMemo(() => {
    let dataList = userListRes?.data;
    return dataList;
  }, [userListRes]);
  const postList = useMemo(() => {
    let dataList = postListRes?.data;
    return dataList;
  }, [postListRes]);
  useEffect(() => {
    setDataSource(
      postList?.map((item: any) => {
        item.poster = userList?.find(
          (item2: any) => item2.userId === item.posterId
        );
        return item;
      })
    );
  }, [postList, userList]);
  const submitReview = (dessertId: any) => {
    fetch(postReviewAddUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewBody: review,
        postId: dessertId,
        reviewTime: dateForm(),
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          alert("评论成功！");
        }
      })
      .catch((res) => {
      });
  };
  return !error && !error2 ? (
    !loading && !loading2 ? (
      <div className="com-body">
        <div className="post-header">帖子列表</div>
        <div className="post-list">
          {dataSource?.length
            ? dataSource.map((item: any, index) => {
                return (
                  <div className="post-item" key={index}>
                    <div className="title">{item.postTitle}</div>
                    <div className="poster">
                      <span>发布人：</span>
                      {item.poster.userName}
                    </div>
                    <div className="body">{item.postBody}</div>
                    <div className="time">
                      <span
                        style={{ color: "rgb(80,186,254)" }}
                        onClick={() => {
                          visible === item.postId
                            ? setVisible(-1)
                            : setVisible(item.postId);
                        }}
                      >
                        {visible !== item.postId ? "查看评论" : "关闭评论"}
                      </span>
                      {userId&&<span
                        style={{ color: "rgb(80,186,254)" }}
                        onClick={() => {
                          setVisible2(true);
                          setTagPost(item.postId);
                        }}
                      >
                        {" "}
                        添加评论
                      </span>}
                      <span></span>
                      <span></span>
                      <span></span>
                      <span>
                        {item.postTime.split(".")[0].replace("T", " ")}
                      </span>
                    </div>
                    {visible===item.postId && <Comment postId={Number(item.postId)} />}
                    <Popup
                      visible={visible2}
                      maskStyle={{ background: "rgba(0, 0, 0, 0.2)" }}
                      onMaskClick={() => {
                        setVisible2(false);
                      }}
                      bodyStyle={{ height: "40vh" }}
                    >
                      <div className="my-item">
                        <span>评论内容： </span>
                        <input
                          type="text"
                          onChange={(e) => {
                            setReview(e.target.value);
                          }}
                          value={review}
                          disabled={false}
                        />
                        <button
                          onClick={() => {
                            submitReview(tagPost);
                          }}
                        >
                          提交评论
                        </button>
                      </div>
                    </Popup>
                  </div>
                );
              })
            : "没有更多了"}
        </div>

        <button
          onClick={() => {
            navigate("/postcreate");
          }}
        >
          +
        </button>
        <Nav curIndex={2} />
      </div>
    ) : (
      <div>loading....</div>
    )
  ) : (
    <div>error!</div>
  );
};

export default Post;
