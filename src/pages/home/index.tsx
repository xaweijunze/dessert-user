import React, { FC, ReactElement, useMemo } from "react";
import Nav from "../../components/nav";
import { IDessert, IDessertListRes } from "../../utils/types";
import {dessertUrl} from '../../utils/baseApi'
import useFetch from "../../utils/useFetch";
import TopList from "./TopList";
import "./index.css";
import Search from "../../components/search";
import Swiper from "../../components/swiper";
import useTitle from "../../utils/useTitle";

const Home: FC = (): ReactElement => {
    let { data, error, loading } = useFetch<IDessertListRes>(dessertUrl);

    const dataSource: IDessert[] = useMemo(() => {
        if (!data) return [];
        return data.data
    }, [data])

    useTitle("dessert蛋糕店");

    return (
        loading ? <p>loading...</p> : error ? <p>error!</p> :
            <div className="home-container">
                <div className="home-search">
                    <Search />
                </div>
                <Swiper dataSource={dataSource} />
                {/* <Menu /> */}
                <TopList />
                <div className="fill"></div>
                <Nav curIndex={0} />
            </div>
    );
}

export default Home;