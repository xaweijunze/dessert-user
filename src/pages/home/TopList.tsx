import { FC, ReactElement, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { dessertAndClassUrl } from "../../utils/baseApi";
import {
  IDessertAndClassRes,
  IDessertClass,
} from "../../utils/types";
import useFetch from "../../utils/useFetch";


const TopList: FC = (): ReactElement => {
  //上次总偏移量
  const [startX, setStartX] = useState<number>(0);
  //开始时坐标
  const [preX, setPreX] = useState<number>(0);
  //总偏移量
  const [shiftX, setShiftX] = useState<number>(0);
  //当前所在位置
  const [index, setIndex] = useState<number>(0);
  const topListRef = useRef<HTMLDivElement>(null);
  //节流函数缓存
  const prevRef = useRef<number>(0);
  const { data, error, loading } =
    useFetch<IDessertAndClassRes>(dessertAndClassUrl);

  const dataSource: [string, IDessertClass[]][] = useMemo(() => {
    if (!data) {
      return [];
    }
    let dataList = data.data
    const classify = new Map<string, IDessertClass[]>();
    dataList.forEach((item) => {
      classify.set(
        item.class.className,
        classify.get(item.class.className)
          ? [item, ...classify.get(item.class.className)!]
          : [item]
      );
    });
    const arr = Array.from(classify);
    arr.forEach((item) => {
      item[1].splice(4, item[1].length);
    });
    return arr;
  }, [data]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!topListRef.current) {
      return;
    }
    topListRef.current.style.transition = "none";
    setPreX(e.changedTouches[0].pageX);
    setStartX(shiftX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!topListRef.current) {
      return;
    }
    const cur = new Date().valueOf();
    if (cur - prevRef.current > 30) {
      topListRef.current.style.transition = "none";
      const tmp = startX + e.changedTouches[0].pageX - preX;
      //边界判断
      if (tmp > 0) setShiftX(0);
      else if (tmp < -2.64 * document.body.offsetWidth)
        setShiftX(-2.64 * document.body.offsetWidth);
      else setShiftX(tmp);
      prevRef.current = cur;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!topListRef.current) {
      return;
    }
    const differ = e.changedTouches[0].pageX - preX;
    if (Math.abs(differ) > document.body.offsetWidth * 0.2) {
      const tmp =
        -(index - Math.abs(differ) / differ) * document.body.offsetWidth * 0.88;
      if (tmp > 0) {
        setShiftX(0);
        setIndex(0);
      } else if (tmp < -2.64 * document.body.offsetWidth) {
        setShiftX(-2.64 * document.body.offsetWidth);
        setIndex(3);
      } else {
        topListRef.current.style.transition = ".5s";
        setShiftX(tmp);
        setIndex(index - Math.abs(differ) / differ);
      }
    } else {
      topListRef.current.style.transition = ".5s";
      setShiftX(-index * document.body.offsetWidth * 0.88);
    }
  };

  return (
    <div className="toplist-container">
      <div className="topList-label">人气热销榜单</div>
      <div
        className="topList"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={topListRef}
        style={{ transform: `translate3D(${shiftX}px,0,0) ` }}
      >
        {loading ? (
          <p>loading...</p>
        ) : error ? (
          <p>error!</p>
        ) : (
          dataSource.map((item) => {
            return (
              <div key={item[0]}>
                <div className="topList-title">{`${item[0]}TOP榜单`}</div>
                <div className="topList-content">
                  {item[1].map((data) => {
                    return (
                      <Link
                        to={`/buy/${data.dessertId}`}
                        key={data.dessertId}
                        className="toBuy"
                      >
                        <img src={data.dessertPicture} alt={data.dessertName} />
                        <div>
                          <span>{data.dessertName}</span>
                          <span>
                            热销价：
                            <span
                              style={{
                                fontSize: ".28rem",
                                color: "rgb(0, 150, 213)",
                                fontWeight: "bold",
                                verticalAlign: "bottom",
                              }}
                            >
                              {`￥${data.dessertPrice}`}
                            </span>
                          </span>
                          <span>立即抢购</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopList;
