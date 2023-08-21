import React, { ReactElement, FC, Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
const Buy = lazy(() => import('./pages/buy'));
const Cart = lazy(() => import('./pages/cart'));
const Category = lazy(() => import('./pages/category'));
const Comment = lazy(() => import('./pages/comment'));
const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));
const Search = lazy(() => import('./pages/search'));
const User = lazy(() => import('./pages/user'));
const Order = lazy(() => import('./pages/order'));
const Post = lazy(() => import('./pages/post'));
const PostUser = lazy(() => import('./pages/postUser'));
const UserEdit = lazy(() => import('./pages/userEdit'));
const PostCreate = lazy(() => import('./pages/postCreate'));
const PostEdit = lazy(() => import('./pages/postEdit'));
const OrderCreate = lazy(() => import('./pages/orderCreate'));
const App: FC = (): ReactElement => {
  return (
    <Suspense fallback={<p>等待加载中...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/login" element={localStorage.getItem("token") ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={localStorage.getItem("token") ? <Navigate to="/" /> : <Register />} />
        <Route path="/user" element={localStorage.getItem("token") ? <User /> : <Navigate to="/login" replace/>} />
        <Route path="/search" element={<Search />} />
        <Route path="/buy/:id" element={<Buy />} />
        <Route path="/order/:id" element={localStorage.getItem("token") ? <Order /> : <Navigate to="/login" replace/>} />
        <Route path="/cart" element={localStorage.getItem("token") ? <Cart /> : <Navigate to="/login" replace/>} />
        <Route path="/comment" element={localStorage.getItem("token") ? <Comment /> : <Navigate to="/login" replace/>} />
        <Route path="/post" element={<Post/>} />
        <Route path="/postuser" element={localStorage.getItem("token") ? <PostUser /> : <Navigate to="/login" replace/>} />
        <Route path="/useredit" element={localStorage.getItem("token") ? <UserEdit /> : <Navigate to="/login" replace/>} />
        <Route path="/postcreate" element={localStorage.getItem("token") ? <PostCreate /> : <Navigate to="/login" replace/>} />
        <Route path="/postedit/:id" element={localStorage.getItem("token") ? <PostEdit /> : <Navigate to="/login" replace/>} />
        <Route path="/ordercreate" element={localStorage.getItem("token") ? <OrderCreate /> : <Navigate to="/login" replace/>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
