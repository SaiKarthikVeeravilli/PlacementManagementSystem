
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import api from "../services/axios";

function NavBar() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  // ==============================
  // NOTIFICATION STATES
  // ==============================

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification ON/OFF setting
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const navigate = useNavigate();


  // ==============================
  // CHECK LOGIN + NOTIFICATION SETTING
  // ==============================

  useEffect(() => {

    const checkLogin = async () => {

      try {

        const res = await api.get("/me");

        if (res.data.success) {

          setLoggedIn(true);
          setRole(res.data.user.role);

          // Get notification preference from database
          setNotificationsEnabled(
            res.data.user.notificationsEnabled ?? true
          );

        }

      } catch (err) {

        setLoggedIn(false);
        setRole("");
        setNotificationsEnabled(true);

      }

    };

    checkLogin();

  }, []);


  // ==============================
  // GET UNREAD NOTIFICATION COUNT
  // ==============================

  useEffect(() => {

    // Don't fetch notifications if:
    // 1. User is not logged in
    // 2. Notifications are disabled

    if (!loggedIn || !notificationsEnabled) {

      setUnreadCount(0);

      return;
    }


    const getUnreadCount = async () => {

      try {

        const res = await api.get(
          "/notifications/unread-count"
        );

        if (res.data.success) {

          setUnreadCount(res.data.count || 0);

        }

      } catch (err) {

        console.log(
          err.response?.data?.message ||
          "Unable to fetch notification count"
        );

        setUnreadCount(0);

      }

    };

    getUnreadCount();

const interval = setInterval(() => {
  getUnreadCount();
}, 30000);

return () => clearInterval(interval);

  }, [loggedIn, notificationsEnabled]);
  


  // ==============================
  // GET NOTIFICATIONS
  // ==============================

  const getNotifications = async () => {

    if (!notificationsEnabled) {

      setNotifications([]);

      return;

    }

    try {

      const res = await api.get("/notifications");

      if (res.data.success) {

        const allNotifications =
          res.data.notifications || [];

        const now = new Date();

        // Application notifications remain visible.
        // Other notifications expire after 30 days.

        const activeNotifications =
          allNotifications.filter((notification) => {

            if (notification.type === "application") {

              return true;

            }

            const createdDate = new Date(notification.createdAt);

            if (isNaN(createdDate.getTime())) {
                return false;
            }

            const differenceInDays =
              (now - createdDate) /
              (1000 * 60 * 60 * 24);

            return differenceInDays <= 30;

          });

        setNotifications(activeNotifications);

      }

    } catch (err) {

      console.error(
        "Error fetching notifications:",
        err
      );

      setNotifications([]);

    }

  };
  


  // ==============================
  // OPEN NOTIFICATIONS
  // ==============================

  const notificationHandler = async () => {

    // If notifications are disabled,
    // don't open anything

    if (!notificationsEnabled) {

      return;

    }


    // Toggle dropdown

    setShowNotifications(
      !showNotifications
    );


    // Fetch notifications when opening

    if (!showNotifications) {

      await getNotifications();

    }

  };


  // ==============================
  // MARK NOTIFICATION AS READ
  // ==============================

  const markAsRead = async (notification) => {

    try {

      if (!notification.isRead) {

        await api.put(
          `/notifications/${notification._id}/read`
        );

      }


      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );


          setUnreadCount((prevCount) =>
        notification.isRead
          ? prevCount
          : Math.max(prevCount - 1, 0)
      );

      setShowNotifications(false);

    } catch (err) {

      console.error(
        "Error marking notification as read:",
        err
      );

    }

  };
  const markAllAsRead = async () => {
  try {
    await api.put("/notifications/read-all");

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true
      }))
    );

    setUnreadCount(0);
  } catch (err) {
    console.error(
      "Error marking all notifications as read:",
      err
    );
  }
};


  // ==============================
  // LOGOUT
  // ==============================

  const ClickHandler = async function () {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );


    if (!confirmLogout) {

      return;

    }


    try {

      const res = await api.get("/logout");

      if (res.status === 200) {

        alert(res.data.message);

        setLoggedIn(false);
        setRole("");
        setNotifications([]);
        setUnreadCount(0);
        setNotificationsEnabled(true);
        setShowNotifications(false);

        navigate("/");

      }

    } catch (err) {

      if (err.response?.status === 401) {

        navigate("/login");

        return;

      }

      alert(
        err.response?.data?.message ||
        "Logout failed"
      );

    }

  };


  // ==============================
  // DASHBOARD
  // ==============================

  const dashboardHandler = () => {

    if (role === "admin") {

      navigate("/admin-dashboard");

    } else {

      navigate("/dashboard");

    }

  };


  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {

    return new Date(date).toLocaleString();

  };


  // ==============================
  // UI
  // ==============================

  return (

    <div>

      <nav className="Main">


        {/* ==============================
            LOGO / TITLE
        ============================== */}

        <div className="pms">

          <img src="" alt="" />

          <p>
            Placement Management System
          </p>

        </div>


        {/* ==============================
            NAVIGATION LINKS
        ============================== */}

        <div className="links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/companies">
            Companies
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>


          {role !== "admin" && (

            <Link to="/applications">
              My Applications
            </Link>

          )}

        </div>


        {/* ==============================
            RIGHT SIDE
        ============================== */}

        {loggedIn ? (

          <div className="buttons">


            {/* ==============================
                NOTIFICATIONS
            ============================== */}

            {role !== "admin" && notificationsEnabled && (

              <div className="notification-wrapper">

                <button
                  className="notification-button"
                  onClick={notificationHandler}
                >

                  🔔

                  {unreadCount > 0 && (

                   <span className="notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>

                  )}

                </button>


                {/* ==============================
                    NOTIFICATION DROPDOWN
                ============================== */}

                {showNotifications && (

                  <div className="notification-dropdown">

                   <div className="notification-header">

                  <h3>
                    Notifications
                  </h3>

                  <div className="notification-header-actions">

                    {unreadCount > 0 && (
                      <button
                        className="mark-all-read-button"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}

                    <button
                      className="close-notification-button"
                      onClick={() => setShowNotifications(false)}
                    >
                      ✕
                    </button>

                  </div>

                </div>

                    {notifications.length === 0 ? (

                      <p className="no-notifications">

                        No notifications

                      </p>

                    ) : (

                      <div className="notification-list">

                        {notifications.map(
                          (notification) => (

                            <div
                              key={notification._id}

                              className={
                                notification.isRead
                                  ? "notification-item"
                                  : "notification-item unread"
                              }

                              onClick={() =>
                                markAsRead(
                                  notification
                                )
                              }
                            >

                              <p>
                                {notification.message}
                              </p>

                              <small>
                                {formatDate(
                                  notification.createdAt
                                )}
                              </small>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                )}

              </div>

            )}


            {/* ==============================
                LOGOUT
            ============================== */}

            <button
              onClick={ClickHandler}
            >
              Logout
            </button>


            {/* ==============================
                DASHBOARD
            ============================== */}

            <button
              onClick={dashboardHandler}
            >
              Go to Dashboard
            </button>

          </div>

        ) : (

          <div className="buttons">

            <Link to="/login">

              <button>
                Login
              </button>

            </Link>


            <Link to="/signup">

              <button>
                Signup
              </button>

            </Link>

          </div>

        )}

      </nav>

    </div>

  );

}


export default NavBar;

