import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import {
  userListByPostUrl,
  userListUserUrl,
  postDeleteUrl,
} from "../../utils/baseApi";
import useTitle from "../../utils/useTitle";
import "./index.css";
import { useNavigate } from "react-router";
import useFetch from "../../utils/useFetch";

const PostUser: FC = (): ReactElement => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useTitle("我发布的帖子");
  const {
    data: postListRes,
    error,
    loading,
  } = useFetch<any>(userListByPostUrl, {
    headers: {
      "x-access-token": token,
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
    postList &&
      setDataSource(
        postList?.map((item: any) => {
          item.poster = userList?.find(
            (item2: any) => item2.userId === item.posterId
          );
          return item;
        })
      );
  }, [postList, userList]);
  const deleteSubmit = (postId: any) => {
    fetch(postDeleteUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          window.location.reload();
          alert("删除成功！");
        }
      })
      .catch((res) => {
      });
  };
  return !error && !error2 ? (
    !loading && !loading2 ? (
      <div className="com-body">
        <div className="post-header">我的帖子列表</div>
        <div className="post-list">
          {dataSource?.length
            ? dataSource.map((item: any, index) => {
                return (
                  <div className="post-item" key={index}>
                    <div className="title">
                      {item.postTitle}
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span onClick={()=>{
                        navigate(`/postedit/${item.postId}`, { replace: true });
                      }}>编辑</span>
                      <span onClick={()=>{deleteSubmit(item.postId)}}>删除</span>
                    </div>
                    <div className="poster">
                      <span>发布人：</span>
                      {item.poster.userName}
                    </div>
                    <div className="body">{item.postBody}</div>
                    <div className="time">
                      {item.postTime.split(".")[0].replace("T", " ")}
                    </div>
                  </div>
                );
              })
            : "没有更多了"}
        </div>
      </div>
    ) : (
      <div>loading....</div>
    )
  ) : (
    <div>error!</div>
  );
};

export default PostUser;
