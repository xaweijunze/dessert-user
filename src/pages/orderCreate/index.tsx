import { FC, ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  dessertByIdArrUrl,
  createOrderUrl,
  orderAddDessertUrl,
} from "../../utils/baseApi";
import { IDessert } from "../../utils/types";
import useTitle from "../../utils/useTitle";
import { dateForm } from "../../utils/date";
import { Space, Radio } from "antd-mobile";
import "./index.css";
interface IOrder {
  consigneeName?: string | undefined;
  consigneePhone?: string | undefined;
  orderTime?: string | undefined;
  payType?: string | undefined;
  payAmount?: number | undefined;
  address?: string | undefined;
  orderState?: string | undefined;
  orderGoods?: IDessert[] | undefined;
  dessertIdList?: number[] | undefined;
}
const OrderCreate: FC = (): ReactElement => {
  const [dessertList, setDessertList] = useState<IDessert[]>([]);
  const { state } = useLocation();
  const [orderInfo, setOrderInfo] = useState<IOrder>();

  useTitle("创建订单");
  const dessertIdArr = String(state).split(',')
  useEffect(() => {
    fetch(dessertByIdArrUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dessertIdStr: state,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          setDessertList(data);
        }
      })
      .catch((res) => {
      });
  }, [state]);
  useEffect(() => {
    let amount = 0;
    dessertList.forEach((item) => {
      amount += item.dessertPrice;
    });
    setOrderInfo({ ...orderInfo, payAmount: amount });
  }, [dessertList]);
  const handleName = (e: any) => {
    setOrderInfo({ ...orderInfo, consigneeName: e.target.value });
  };
  const handlePhone = (e: any) => {
    setOrderInfo({ ...orderInfo, consigneePhone: e.target.value });
  };
  const handleAddress = (e: any) => {
    setOrderInfo({ ...orderInfo, address: e.target.value });
  };
  const submitCreateOrder = async () => {
    fetch(createOrderUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...orderInfo, orderTime: dateForm() }),
    })
      .then((response) => response.json())
      .then((json) => {
        
        Promise.all([
          ...dessertIdArr.map((item) => {
            const res = {
                dessertId: item,
                orderId: json.data["@@IDENTITY"]
             }
            return fetch(orderAddDessertUrl, {
              method: "post",
              headers: { 
                "Content-Type": "application/json",  
                'x-access-token': localStorage.getItem("token")! },
              body: JSON.stringify(res)
            });
          }),
        ]).then((val) => {
            alert("购买成功，可以去订单列表查看哦")});
      })
      .catch((res) => {
        alert("请检查网络！");
      });
  };
  return (
    <div className="com-body">
      <div className="order-header">创建订单</div>
      <div className="order-list">
        <div className="order-item">
          {dessertList?.map((d, index, arr) => {
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
                </div>
              </div>
            );
          })}
          <div className="my-item">
            <span>付款方式：</span>{" "}
            <Radio.Group
              value={orderInfo?.payType}
              onChange={(val) => {
                setOrderInfo({ ...orderInfo, payType: val.toString() });
              }}
            >
              <Space direction="vertical" className="pick">
                <Radio value="支付宝支付">支付宝支付</Radio>
                <Radio value="微信支付">微信支付</Radio>
                <Radio value="货到付款">货到付款</Radio>
              </Space>
            </Radio.Group>
          </div>
          <div className="my-item">
            <span>收货人员： </span>{" "}
            <input
              type="text"
              onChange={handleName}
              value={orderInfo?.consigneeName}
            />
          </div>
          <div className="my-item">
            <span>联系电话：</span>{" "}
            <input
              type="text"
              onChange={handlePhone}
              value={orderInfo?.consigneePhone}
            />
          </div>
          <div className="my-item">
            <span>收货地址：</span>{" "}
            <input
              type="text"
              onChange={handleAddress}
              value={orderInfo?.address}
            />
          </div>

          <div className="order-time">
            <div className="all-money">
              <span>
                <span>共</span>
                <span>{dessertList.length}</span>
                <span>件</span>
              </span>
              <span>
                <span>总额：{orderInfo?.payAmount}元</span>
                <span className="order-color"></span>
              </span>
            </div>
            <button onClick={submitCreateOrder}>提交订单</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;
