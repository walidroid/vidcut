import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.less";

const Sidebar = () => {
  const navList = [
    {
      name: "User Agreement",
      path: "/user/agreement",
    },
    {
      name: "Privacy Policy",
      path: "/user/privacy",
    },
    {
      name: "VIP Agreement",
      path: "/user/vipService",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.navList}>
        {navList.map((item) => (
          <NavLink
            activeClassName={styles.active}
            to={item.path}
            key={item.name}
          >
            <div className={styles.navItem}>
              <span className={styles.text}>{item.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
