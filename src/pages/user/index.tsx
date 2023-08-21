import { FC, ReactElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../../components/nav";
import useTitle from "../../utils/useTitle";
import {userInfoUrl} from '../../utils/baseApi'
import "./index.css";
interface userInfo {
  userId?: string | undefined;
  userName?: string | undefined;
  userPhone?: string | undefined;
  userPassword?: string | undefined;
  userHeader?: string | undefined;
  userContent?: string | undefined;
}
const User: FC = (): ReactElement => {
  const [userInfo, setUuserInfo] = useState<userInfo>();
  const navigate = useNavigate();
  const order = { one: 0, two: 1, three: 2, four: 3 };
  useTitle("用户中心");

  useEffect(() => {
    let unMount = false;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(userInfoUrl, {
      headers: { "x-access-token": token },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          return res.json();
        }
      })
      .then((json) => {
        if (!unMount) {
          setUuserInfo(json.data);
        }
      });
    return () => {
      unMount = true;
    };
  }, [navigate]);

  return (
    <div className="user">
      <div>个人中心</div>
      <div>
        <img src={userInfo?.userHeader} alt="" />
        <span>{userInfo?.userName}</span>
        <div className="my-order my-item">
          <Link to={`/order/${order.one}`} className="header">
            <span>我的订单</span>
            <span>查看全部</span>
          </Link>
          <div className="item">
            <Link to={`/order/${order.two}`}>未发货</Link>
            <Link to={`/order/${order.three}`}>已发货</Link>
            <Link to={`/order/${order.four}`}>已完成</Link>
          </div>
        </div>
        <Link className="my-item" to={"/userEdit"}>
          个人信息
        </Link>
        <Link className="my-item" to={"/postuser"}>
          我的贴子
        </Link>
        <Link className="my-item" to={""}>
          关于
        </Link>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        退出登录
      </button>
      <Nav curIndex={4} />
    </div>
  );
};
export default User;
