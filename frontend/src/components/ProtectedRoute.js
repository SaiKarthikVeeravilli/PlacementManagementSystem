import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../services/axios";

function ProtectedRoute({ adminOnly = false }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    api.get("/me")
      .then((res) => {
        if (!active) return;

        const currentUser = res.data.user;

        if (adminOnly && currentUser.role !== "admin") {
          setStatus("forbidden");
          return;
        }

        setUser(currentUser);
        setStatus("authenticated");
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, [adminOnly]);

  if (status === "checking") {
    return <p>Checking authentication...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={{ user }} />;
}

export default ProtectedRoute;