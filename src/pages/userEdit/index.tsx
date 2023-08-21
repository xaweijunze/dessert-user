import { FC, ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../../utils/useTitle";
import { encrypt, decrypt } from "../../utils/crytojs";
import {userInfoUrl} from '../../utils/baseApi'
import { userInfoEditUrl } from "../../utils/baseApi";
import "./index.css";
interface userInfo {
  userId?: string | undefined;
  userName?: string | undefined;
  userPhone?: string | undefined;
  userPassword?: string | undefined;
  userHeader?: string | undefined;
  userContent?: string | undefined;
}
const UserEdit: FC = (): ReactElement => {
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [buttonTitle, setTitle] = useState<string[] | undefined>([
    "开始编辑",
    "返回",
  ]);
  const navigate = useNavigate();
  useTitle("个人信息");

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
          setUserInfo(json.data);
        }
      });
    return () => {
      unMount = true;
    };
  }, [navigate]);
  const submitEdit = async () => {
    if (disabled) {
      setDisabled(false);
      setTitle(["提交修改", "取消更改"]);
      return;
    } else {
      setDisabled(true);
      fetch(userInfoEditUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          ...userInfo,
          userPhone:encrypt(userInfo?.userPhone),
          userPassword:encrypt(userInfo?.userPassword),
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          const { data } = json;
          if (!data) {
            alert("错误");
          } else {
            alert("修改成功");
            window.location.reload();
            navigate("/useredit", { replace: true });
          }
        })
        .catch((res) => {
          alert("检查网络后重试");
        });
      setTitle(["开始编辑", "返回"]);
    }
  };
  const cancelEdit = () => {
    if (disabled) {
      navigate("/user");
      return;
    } else {
      setDisabled(true);
      setTitle(["开始编辑", "返回"]);
    }
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, userName: e.target.value });
  };
  const handleInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, userContent: e.target.value });
  };
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, userPhone: e.target.value });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, userPassword: e.target.value });
  };

  return (
    <div className="user">
      <div>个人中心</div>
      <div className="edit-from">
        <div className="header">
          <img src={userInfo?.userHeader} alt="" />
        </div>
        <div className=" my-item">
          <span>名称： </span>
          <input
            type="text"
            onChange={handleName}
            value={userInfo?.userName}
            disabled={disabled}
          />
        </div>
        <div className="my-item">
          <span>介绍： </span>
          <input
            type="text"
            onChange={handleInfo}
            value={userInfo?.userContent}
            disabled={disabled}
          />
        </div>
        <div className="my-item">
          <span>手机： </span>
          <input
            type="text"
            onChange={handlePhone}
            value={userInfo?.userPhone}
            disabled={disabled}
          />
        </div>
        <div className="my-item">
          <span>密码： </span>
          <input
            onChange={handlePassword}
            type="password"
            value={userInfo?.userPassword}
            disabled={disabled}
          />
        </div>
        <div className="my-item" style={disabled ? { display: "none" } : {}}>
          <span>确认密码： </span>
          <input
            onChange={handlePassword}
            type="password"
            value={userInfo?.userPassword}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="edit-button">
        <button
          onClick={submitEdit}
          style={!disabled ? { backgroundColor: "red" } : {}}
        >
          {buttonTitle ? buttonTitle[0] : ""}
        </button>
        <button
          onClick={cancelEdit}
          style={!disabled ? { backgroundColor: "red" } : {}}
        >
          {buttonTitle ? buttonTitle[1] : ""}
        </button>
      </div>
    </div>
  );
};
export default UserEdit;
