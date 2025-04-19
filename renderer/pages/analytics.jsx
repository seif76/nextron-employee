import EmployeeAnalytics from "../components/employee/EmployeeAnalytics"
import Navbar from "../components/navigation/navbar";
export default function AnalyticsPage() {
    return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <EmployeeAnalytics />
          </div>
        </div>
      );
  
}
