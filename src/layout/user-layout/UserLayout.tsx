import React from "react";
import { renderRoutes } from "react-router-config";
import PageLoading from "../../components/page-loading";
import { observer } from "mobx-react";
import Header from "@components/header";
import styles from "./userLayout.module.less";
import Sidebar from "./sidebar";
import ColorBg from "../workspace-layout/ColorBg";
import Footer from "@components/footer";
import FolderGuard from "@components/folder-guard/FolderGuard";

function UserLayout({ route }: any) {
  return (
    <FolderGuard>
      <PageLoading />
      <div className={styles.bg}></div>
      <div className={styles.userLayout}>
        <Header />
        <Sidebar />
        <div className={styles.content}>{renderRoutes(route.routes)}</div>
        <ColorBg style={{ top: 0, left: 200 }} />
      </div>
      <Footer />
    </FolderGuard>
  );
}
export default observer(UserLayout);
