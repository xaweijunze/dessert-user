import React, { FC, ReactElement, useMemo, useState, useEffect } from "react";
import useFetch from "../../utils/useFetch";
import {
  userListUserUrl,
  postReviewUrl,
  pReviewDeleteUrl,
} from "../../utils/baseApi";

const Comment: FC<{ postId: number }> = (props: {
  postId: number;
}): ReactElement => {
  const [dataSource, setDataSource] = useState([]);
  const [shiftX, setShiftX] = useState<number>(0);
  const [preX, setPreX] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const userId = localStorage.getItem("userId")||'';
  const {
    data: userListRes,
    error: error2,
    loading: loading2,
  } = useFetch<any>(userListUserUrl);
  const userList = useMemo(() => {
    let dataList = userListRes?.data;
    return dataList;
  }, [userListRes]);
  const {
    data: comments,
    error,
    loading,
  } = useFetch<any>(postReviewUrl, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      postId: props.postId,
    },
  });
  const reviewList = useMemo(() => {
    if (comments)
      if (comments?.data instanceof Array) {
        return comments?.data;
      } else {
        return comments?.data || []
      }
  }, [comments]);
  useEffect(() => {
    setDataSource(
      reviewList?.map((item: any) => {
        item.reviewer = userList?.find(
          (item2: any) => item2.userId === item.reviewerId
        );
        return item;
      })
    );
  }, [reviewList, userList]);
  const hanldeTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setPreX(e.changedTouches[0].pageX);
    setStartX(shiftX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!reviewList) {
      return;
    }
    const tmp = startX + e.changedTouches[0].pageX - preX;
    //边界判断
    if (tmp > 0) setShiftX(0);
    else if (
      tmp <
      -0.8017 * (reviewList.length - 1) * document.body.offsetWidth
    ) {
      setShiftX(-0.8017 * (reviewList.length - 1) * document.body.offsetWidth);
    } else {
      setShiftX(tmp);
    }
  };
  const deleteSubmit = (reviewId: any) => {
    fetch(pReviewDeleteUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewId: reviewId,
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
  return (
    <div className="comment-container">
      <div className="comment-title">
        <span>贴子评价</span>
      </div>
      <div className="comment">
        <div
          className="comment-cards"
          onTouchStart={hanldeTouchStart}
          onTouchMove={handleTouchMove}
          style={{ transform: `translate3D(${shiftX}px,0,0)` }}
        >
          {loading || loading2 ? (
            <p>loading...</p>
          ) : error || error2 ? (
            <p>error!</p>
          ) : (
            dataSource?.map((item: any) => {
              return (
                <div className="comment-card" key={item.reviewId}>
                  <div className="comment-header">
                    <img
                      className="header"
                      src={item.reviewer.userHeader}
                      alt=""
                    />
                    <span>{item.reviewer.userName}</span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span
                      onClick={() => {
                        deleteSubmit(item.reviewId);
                      }}
                    >
                      {Number(item.reviewer.userId) === Number(userId) &&
                        "删除"}
                    </span>
                  </div>
                  <div className="reviewBody">{item.reviewBody}</div>
                  <div className="reviewTime">
                    {item.reviewTime.split(".")[0].replace("T", " ")}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {reviewList?.length === 0 ? (
          <div className="comment-tips">暂无评论</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Comment;
