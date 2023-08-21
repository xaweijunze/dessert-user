import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  orderListByUserUrl,
  dessertUrl,
  dessertReviewAddUrl,
} from "../../utils/baseApi";
import {
  IDessert,
  IDessertListRes,
  IOrderRes,
  IOrder,
} from "../../utils/types";
import useTitle from "../../utils/useTitle";
import "./index.css";
import useFetch from "../../utils/useFetch";
import { useParams } from "react-router";
import { dateForm } from "../../utils/date";
import { Popup } from "antd-mobile";
const Order: FC = (): ReactElement => {
  const [dataSource, setDataSource] = useState<IOrder[]>();
  const [dataActive, setDataActive] = useState<IOrder[]>();
  const active = Number(useParams().id);
  const [visible, setVisible] = useState(false);
  const [activeTag, setActiveTag] = useState(active);
  const [review, setReview] = useState("");
  const [tagDessert, setTagDessert] = useState(-1);
  useTitle("我的订单");
  const { data, error, loading } = useFetch<IOrderRes>(orderListByUserUrl, {
    headers: { "x-access-token": localStorage.getItem("token")! },
  });
  const {
    data: dessertListRes,
    error: error2,
    loading: loading2,
  } = useFetch<IDessertListRes>(dessertUrl, {
    headers: { "x-access-token": localStorage.getItem("token")! },
  });
  const dessertList: IDessert[] | undefined = useMemo(() => {
    let dataList = dessertListRes?.data;
    return dataList;
  }, [dessertListRes]);
  const orderList: IOrder[] | undefined = useMemo(() => {
    let dataList = data?.data;
    return dataList;
  }, [data]);
  useEffect(() => {
    let list = orderList?.map((item) => {
      item.orderGoods = [];
      item.dessertIdList?.forEach((item2) => {
        let dessert = dessertList?.find((item3) => item3.dessertId === item2);
        dessert && item.orderGoods?.push(dessert);
      });
      return item;
    });
    setDataSource(list);
    setDataActive(list);
  }, [dessertList, orderList]);
  useEffect(() => {
    let activeS = "";
    switch (activeTag) {
      case 0:
        activeS = "全部";
        break;
      case 1:
        activeS = "待发货";
        break;
      case 2:
        activeS = "待收货";
        break;
      case 3:
        activeS = "已完成";
        break;
      default:
    }
    let result: IOrder[] = [];
    dataSource?.forEach((item) => {
      if (item.orderState === activeS) result.push(item);
    });
    setDataActive(result);
    if (activeTag === 0) setDataActive(dataSource);
  }, [activeTag, dataSource]);
  const submitReview = (dessertId: any) => {
    fetch(dessertReviewAddUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewBody: review,
        dessertId: dessertId,
        reviewTime: dateForm(),
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          alert('评论成功！')
        }
      })
      .catch((res) => {
      });
  };
  return !error && !error2 ? (
    !loading && !loading2 ? (
      <div className="com-body">
        <div className="order-header">
          <div
            onClick={() => setActiveTag(0)}
            className={activeTag === 0 ? "active" : ""}
          >
            全部
          </div>
          <div
            onClick={() => setActiveTag(1)}
            className={activeTag === 1 ? "active" : ""}
          >
            待发货
          </div>
          <div
            onClick={() => setActiveTag(2)}
            className={activeTag === 2 ? "active" : ""}
          >
            待收货
          </div>
          <div
            onClick={() => setActiveTag(3)}
            className={activeTag === 3 ? "active" : ""}
          >
            已完成
          </div>
        </div>
        <div className="order-list">
          {dataActive?.map((data, index, arr) => {
            return (
              <div className="order-item" id={String(data.orderId)} key={index}>
                <div className="item-header">
                  <p>
                    订单编号:<span>{data.orderId}</span>
                  </p>
                  <div>{activeTag === 3&&<div className="delete">删除</div>}</div>
                </div>
                {data.orderGoods?.map((d, index, arr) => {
                  return (
                    <div className="goods-details" key={index}>
                      <img src={d.dessertPicture} alt="" />
                      <div className="goods-der">
                        <p className="goods-name">{d.dessertName}</p>
                      </div>
                      <div className="price">
                        <p>
                          ￥<span>{d.dessertPrice.toFixed(2)}</span>
                        </p>
                        <p className="goods-num">
                          <span>{1}</span>
                        </p>
                        {data.orderState === "已完成" && (
                          <p className="goods-review">
                            <span
                              onClick={() => {
                                setVisible(true);
                                setTagDessert(d.dessertId)
                              }}
                            >
                              点击评论
                            </span>
                          </p>
                        )}
                        <Popup
                          visible={visible}
                          onMaskClick={() => {
                            setVisible(false);
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
                                submitReview(tagDessert);
                              }}
                            >
                              提交评论
                            </button>
                          </div>
                        </Popup>
                      </div>
                    </div>
                  );
                })}
                <div className="order-time">
                  <p>{data.orderTime.substr(0, 10)}</p>
                  <div className="all-money">
                    <span>
                      <span>共</span>
                      <span>1</span>
                      <span>件</span>
                    </span>
                    <span>
                      <span>总额：￥</span>
                      <span className="order-color">{data.payAmount}</span>
                    </span>
                  </div>
                </div>
                {activeTag === 2 && (
                  <div className="make-box">
                    <Link to="" className="red">
                      去付款
                    </Link>
                    <Link to="" className="red">
                      确认收货
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div>loading....</div>
    )
  ) : (
    <div>error!</div>
  );
};

export default Order;
