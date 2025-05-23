"use client";
import EmployeeAnalytics from "../components/employee/EmployeeAnalytics";
import Navbar from "../components/navigation/navbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import SalaryTable from "../components/employee/SalaryTable";

export default function AnalyticsPage() {
  const router = useRouter();
  const [authinticate, setAuthinticate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      axios
        .get("http://localhost:3000/api/auth/jwtAuth", {
          headers: {
            jwt: token,
          },
        })
        .then((response) => {
          if (response.data.authinticate) {
            setAuthinticate(true);
          } else {
            setAuthinticate(false);
            localStorage.removeItem("jwt");
            router.push("/login");
          }
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          router.push("/login");
          setAuthinticate(false);
        });
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <>
      {authinticate ? (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow p-4 space-y-6">
            <EmployeeAnalytics />
            <SalaryTable />
          </div>
        </div>
      ) : null}
    </>
  );
}
