import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Nav from "../../components/nav";
import { cartListUrl, deleteCartUrl } from "../../utils/baseApi";
import { IDessertListRes, IDessert } from "../../utils/types";
import useTitle from "../../utils/useTitle";
import "./index.css";

const Cart: FC = (): ReactElement => {
  const [selected, setSelected] = useState<boolean[]>([]);
  const [dataSource, setDataSource] = useState<IDessert[]>([]);
  const navigate = useNavigate();

  useTitle("购物车");

  const totalprice = useMemo(() => {
    const totalarr = dataSource.filter(
      (item, index) => selected[index] === true
    );
    return totalarr.reduce(
      (pre, cur) => pre + cur.dessertPrice,
      0
    );
  }, [dataSource, selected]);

  useEffect(() => {
    let unMount = false;
    fetch(cartListUrl, {
      headers: { "x-access-token": localStorage.getItem("token")! },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          return Promise.resolve<IDessertListRes>(res.json());
        }
      })
      .then((json) => {
        if (!unMount) {
          setDataSource(json!.data);
          setSelected(Array(json?.data.length).fill(false));
        }
      });
    return () => {
      unMount = true;
    };
  }, [navigate]);



  const handleSubmit = () => {
    setDataSource(
      dataSource.filter((item, index) => selected[index] === false)
    );
    const requestArr = dataSource.filter(
      (item, index) => selected[index] === true
    );
    const dessertIdArr = requestArr.map(item => item.dessertId)
    fetch(deleteCartUrl, {
      method:'post',
      headers: {
        "x-access-token": localStorage.getItem("token")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dessertIdStr: dessertIdArr.join(',')
      })
    }).then((response) => response.json())
      .then((json) => {
        const { data } = json;
        if (!data) {
          alert("错误");
        } else {
          const state:string = dessertIdArr.join(',')
          navigate("/ordercreate", { replace: true , state});
        }
      })
      .catch((res) => {
      });
  };


  return (
    <div className="cart-container">
      {dataSource.length
        ? dataSource.map((item, index) => (
          <div key={item.dessertId} className="cart-item">
            <div className="cart-wrap">
              <span
                className="cart-selected"
                onClick={() => {
                  selected[index] = !selected[index];
                  setSelected([...selected]);
                }}
                style={{
                  backgroundColor: selected[index] ? "#0096d6" : "#fff",
                }}
              />
              <Link to={`/buy/${item.dessertId}`}>
                <img
                  src={item.dessertPicture}
                  alt={item.dessertName}
                />
              </Link>
              <div>
                <div>
                  <Link to={`/buy/${item.dessertId}`}>
                    {item.dessertName}&nbsp;&nbsp;
                  </Link>
                </div>
                <div>
                  <div className="cart-price">￥{item.dessertPrice}</div>

                </div>
              </div>
            </div>
          </div>
        ))
        : ""}
      <div className="pay-nav">
        <div className="total">
          <span
            style={{
              backgroundColor: selected.every((data) => data)
                ? "#0096d6"
                : "#fff",
            }}
            onClick={() =>
              selected.every((data) => data)
                ? setSelected([...selected.fill(false)])
                : setSelected([...selected.fill(true)])
            }
          />
          <span>全部</span>
          <span className="totalprice">￥{totalprice}</span>
        </div>
        <button className="pay" onClick={handleSubmit}>
          下单
        </button>
      </div>
      <Nav curIndex={3} />
    </div>
  );
};

export default Cart;
