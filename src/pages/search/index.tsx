import { FC, ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { dessertListByKeyUrl } from "../../utils/baseApi";
import ComponentSearch from "../../components/search";
import { Link } from "react-router-dom";
import "./index.css";
import useTitle from "../../utils/useTitle";

interface IState {
  content?: string;
}

const Search: FC = (): ReactElement => {
  const state = useLocation().state as IState;
  const [dessertList, setDessertList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(dessertListByKeyUrl, {
      method: "post",
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: state.content,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false);

        const { data } = json;
        if (!data) {
          alert("错误");
          setError(true);
        } else {
          setDessertList(data);
        }
      })
      .catch((res) => {});
  }, [state]);

  useTitle("商品");

  return (
    <div className="search-page">
      <div className="search">
        <ComponentSearch />
      </div>
      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>error!</p>
      ) : (
        dessertList.map((item: any) => (
          <Link
            to={`/buy/${item.dessertId}`}
            key={item.dessertId}
            className="search-item"
          >
            <img src={item.dessertPicture} alt={item.dessertName} />
            <div>{item.dessertName}</div>
            <div>￥{item.dessertPrice}</div>
          </Link>
        ))
      )}
      <div className="search-tips">没有更多了</div>
    </div>
  );
};

export default Search;
