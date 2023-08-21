import React, { FC, ReactElement, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { dessertByIdUrl } from "../../utils/baseApi";
import { IDessert, IDessertRes } from "../../utils/types";
import useFetch from "../../utils/useFetch";
import useTitle from "../../utils/useTitle";
import { useNavigate } from "react-router";
import Comment from "./Comment";
import Footer from "./Footer";
import "./index.css";

const Buy: FC = (): ReactElement => {
  const [index, setIndex] = useState<number>(0);
  const [shiftX, setShiftX] = useState<number>(0);
  const [preX, setPreX] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const picList = useRef<HTMLDivElement>(null);
  const params = useParams();
  const navigate = useNavigate()
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dessertId: params.id,
    }),
  };
  const { data, error, loading } = useFetch<IDessertRes>(
    dessertByIdUrl,
    options
  );

  const dataSource: IDessert | undefined = useMemo(() => {
    if (data) {
      //   setSelectedColor(colors[0].value);
      return data.data;
    }
    return undefined;
  }, [data]);

  useTitle(dataSource ? dataSource.dessertName : "购买商品");

  //   const changeValue = (color: string) => {
  //     setSelectedColor(color);
  //   };

 
 

  const hanldeTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (picList.current) {
      picList.current.style.transition = "none";
      setPreX(e.changedTouches[0].pageX);
      setStartX(shiftX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (picList.current && dataSource) {
      picList.current.style.transition = "none";
      const tmp = startX + e.changedTouches[0].pageX - preX;
      //边界判断
      if (tmp > 0) {
        setShiftX(0);
      } else if (
        tmp <
        -(dataSource.dessertPicture.length - 1) * document.body.offsetWidth
      ) {
        setShiftX(
          -(dataSource.dessertPicture.length - 1) * document.body.offsetWidth
        );
      } else {
        setShiftX(tmp);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dataSource || !picList.current) {
      return;
    }
    const differ = e.changedTouches[0].pageX - preX;
    if (Math.abs(differ) > document.body.offsetWidth * 0.2) {
      const tmp =
        -(index - Math.abs(differ) / differ) * document.body.offsetWidth;
      if (tmp > 0) {
        setShiftX(0);
        setIndex(0);
      } else if (
        tmp <
        -(dataSource.dessertPicture.length - 1) * document.body.offsetWidth
      ) {
        setShiftX(
          -(dataSource.dessertPicture.length - 1) * document.body.offsetWidth
        );
        setIndex(dataSource.dessertPicture.length - 1);
      } else {
        picList.current.style.transition = ".5s";
        setShiftX(tmp);
        setIndex(index - Math.abs(differ) / differ);
      }
    } else {
      picList.current.style.transition = ".5s";
      setShiftX(-index * document.body.offsetWidth);
    }
  };

  return (
    <div className="buy">
      <button className="back" onClick={()=>{navigate('/home')}}>返回</button>
      <div className="buy-pic">
        <div
          className="picList"
          ref={picList}
          onTouchStart={hanldeTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: `${dataSource?.dessertPicture?.length}00%`,
            transform: `translate3D(${shiftX}px,0,0)`,
          }}
        >
          {loading ? (
            <p>loading...</p>
          ) : error ? (
            <p>error!</p>
          ) : (
            <img
              src={dataSource ? dataSource.dessertPicture : ""}
              alt={dataSource ? dataSource.dessertName : ""}
            />
          )}
        </div>
      </div>
      <div className="buy-main">
        <div className="buy-description">
          <span>￥{dataSource?.dessertPrice}</span>
          <span>{dataSource?.dessertName}</span>
        </div>
        <div className="buy-option">
          <div className="colors">
            <span className="title">介绍：</span>{dataSource?.dessertIntroduce}
          </div>
          <div className="colors">
            <span className="title">原料：</span>{dataSource?.dessertMaterial}
          </div>
          <div className="colors">
            <span className="title">包装：</span>{dataSource?.dessertPack}
          </div>
        </div>
      </div>
      <Comment dessertId={Number(params.id)} />
      <Footer dataSource={dataSource!} quantity={quantity} />
      <div className="buy-fill"></div>
    </div>
  );
};

export default Buy;
