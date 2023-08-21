import { FC, ReactElement } from "react";
import { useNavigate } from "react-router";
import base from "../../utils/baseUrl";
import { addCartUrl } from "../../utils/baseApi";
import { IDessert } from "../../utils/types";

interface IProps {
  dataSource: IDessert;
  type: string;
  setConfirmvisible: Function;
  quantity: number;
}

const Confirm: FC<IProps> = (props: IProps): ReactElement => {
  // const colorName = useMemo(() => {
  //     const colors = props.dataSource.colors;
  //     return colors.filter(item => item.value === props.color)[0]?.name;
  // }, [props.dataSource, props.color]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    props.setConfirmvisible(false);
    if (props.type === "cart") {
      fetch(addCartUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")!,
        },
        body: JSON.stringify({
          dessertId: props.dataSource.dessertId,
        }),
      })
        .then((val) => {
          if (Number(val.status) === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          } else alert("已添加至购物车");
        })
        .catch((res) => alert("添加购物车失败，检查网络后重试"));
    } else if (props.type === "buy") {
      fetch(`${base}/pays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")!,
        },
        body: JSON.stringify({
          goodId: props.dataSource.dessertId,
        }),
      })
        .then((val) => {
          if (val.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          } else {
            alert("购买成功，可以在待评价留下你的评价~");
          }
        })
        .catch((res) => alert("购买失败，检查网络后重试"));
    }
  };

  return (
    <div className="confirm">
      <span
        className="confirm-cancel"
        onClick={() => props.setConfirmvisible(false)}
      ></span>
      <div className="confirm-main">
        <img
          src={props.dataSource.dessertPicture}
          alt={props.dataSource.dessertName}
        />
        <div>
          <div>￥{props.dataSource.dessertPrice}</div>
          <div>{props.dataSource.dessertName}</div>
        </div>
      </div>
      {/* <div className="confirm-colors">
                <span>颜色</span>
                <span>{colorName}</span>
            </div> */}
      <div className="quantity">
        <span>数量</span>
        <span>{props.quantity}</span>
      </div>
      <button onClick={handleSubmit} className="confirm-submit">
        {props.type === "buy" ? "立即购买" : "确定"}
      </button>
    </div>
  );
};

export default Confirm;
