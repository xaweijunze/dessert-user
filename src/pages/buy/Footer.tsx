import { FC, ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import { IDessert } from "../../utils/types";
import Confirm from "./Confirm";

interface IProps {
    dataSource: IDessert,
    quantity: number
}

const Footer: FC<IProps> = (props: IProps): ReactElement => {
    const [confirmvisible, setConfirmvisible] = useState<boolean>(false);
    const [type, setType] = useState<string>("");
    const navigate = useNavigate();

    const handleAddForCart = () => {
        setConfirmvisible(true);
        setType("cart");
    }

    const handleAddForBuy = () => {
        setConfirmvisible(true);
        setType("buy");
    }

    return (
        <>
            <div className="buy-footer">
                <div>
                    <span className="iconfont">&#xe61d;</span>
                    <span onClick={() => navigate("/cart")}>购物车</span>
                </div>
                <div>
                </div>
                <div>
                </div>
                <div>
                </div>
                <button onClick={handleAddForCart}>加入购物车</button>
            </div>
            {
                confirmvisible ?
                    <Confirm
                        dataSource={props.dataSource}
                        type={type}
                        setConfirmvisible={setConfirmvisible}
                        quantity={props.quantity}
                    /> : ""
            }
        </>
    );
}

export default Footer;