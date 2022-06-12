import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { MainLayout } from "../Components/Layouts/MainLayout";
import { GalleryPage } from "./GalleryPage";
import { ExhibitionsPage } from "./ExhibitionsPage";
import { ExcursionsPage } from "./ExcursionsPage";
import { HomePage } from "./HomePage";
import { InfoPage } from "./InfoPage";
import { NewsPage } from "./NewsPage";
import { NotFoundPage } from "./NotFoundPage";
import { RegisterPage } from "./AuthPages/RegisterPage";
import { LoginPage } from "./AuthPages/LoginPage";
import { RequestedPosts } from "./AdminPages/RequestedPosts";
import { ExcursionsItemPage } from "./UnitPages/ExcursionItemPage";

import { useParams } from "react-router-dom";
import { ExhibitionItemPage } from "./UnitPages/ExhibitionItemPage";
import { NewsItemPage } from "./UnitPages/NewsItemPage";

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const isAdmin = useSelector((state) => state.user.role === 1);

  function checkUserType() {
    if (!isAuth) {
      return (
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="exhibitions" element={<ExhibitionsPage />} />
            <Route path="exhibitions/:id" element={<ExhibitionItemPage />} />
            <Route path="excursions" element={<ExcursionsPage />} />
            <Route path="excursion/:id" element={<ExcursionsItemPage />} />
            <Route path="registration" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="about" element={<InfoPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsItemPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      );
    } else if (isAuth && isAdmin) {
      return (
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="exhibitions" element={<ExhibitionsPage />} />
            <Route path="exhibitions/:id" element={<ExhibitionItemPage />} />
            <Route path="excursions" element={<ExcursionsPage />} />
            <Route path="excursions/:id" element={<ExcursionsItemPage />} />
            <Route
              path="registration"
              element={<Navigate to="/gallery" replace={true} />}
            />
            <Route
              path="login"
              element={<Navigate to="/gallery" replace={true} />}
            />
            <Route path="reqposts" element={<RequestedPosts />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="about" element={<InfoPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsItemPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      );
    } else if (isAuth) {
      return (
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="exhibitions" element={<ExhibitionsPage />} />
            <Route path="excursions" element={<ExcursionsPage />} />
            <Route
              path="registration"
              element={<Navigate to="/gallery" replace={true} />}
            />
            <Route
              path="login"
              element={<Navigate to="/gallery" replace={true} />}
            />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="about" element={<InfoPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      );
    }
  }

  return <>{checkUserType()}</>;
}

export default App;
