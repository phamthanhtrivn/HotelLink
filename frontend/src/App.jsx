import ProtectedRoutes from "./routes/ProtectedRoutes";
import CustomerLayout from "./layouts/CustomerLayout";
import StaffDashboard from "./pages/employee/StaffDashboard";
import EmployeeLayout from "./layouts/EmployeeLayout";
import Home from "./pages/customer/Home";
import Login from "./pages/Login";
import OAuth2Success from "./pages/customer/OAuth2Success";
import Register from "./pages/customer/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RoomTypes from "./pages/customer/RoomTypes";
import RoomTypeDetail from "./pages/customer/RoomTypeDetail";
import Booking from "./pages/customer/Booking";
import Payment from "./pages/customer/Payment";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import PaymentFailed from "./pages/customer/PaymentFailed";
import Facility from "./pages/customer/Facility";
import AboutUs from "./pages/customer/AboutUs";
import Contact from "./pages/customer/Contact";
import AccountInfo from "./pages/customer/AccountInfo";
import BookingHistory from "./pages/customer/BookingHistory";
import BookingManagement from "./pages/employee/BookingManagement";
import RoomAvailability from "./pages/employee/RoomAvailability";
import AdminDashBoard from "./pages/employee/AdminDashBoard";
import RoomManagement from "./pages/employee/RoomManagement";
import RoomTypeManagement from "./pages/employee/RoomTypeManagement";
import CustomerManagement from "./pages/employee/CustomerManagement";
import StaffManagement from "./pages/employee/StaffManagement";
import ReviewManagement from "./pages/employee/ReviewManagement";
import ServiceManagement from "./pages/employee/ServiceManagement";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import OAuth2Failed from "./pages/customer/OAuth2Failed";

const App = () => {
  return (
    <Routes>
      <Route path="reset-password" element={<ResetPassword />} />
      {/* GUEST */}
      <Route
        element={
          <ProtectedRoutes allowedRoles={["GUEST", "MEMBER"]}>
            <CustomerLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="oauth2/success" element={<OAuth2Success />} />
        <Route path="oauth2/failed" element={<OAuth2Failed />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="room-types" element={<RoomTypes />} />
        <Route path="room-types/:id" element={<RoomTypeDetail />} />
        <Route path="booking" element={<Booking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/failed" element={<PaymentFailed />} />
        <Route path="facility" element={<Facility />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* MEMBER */}
      <Route
        path="/member"
        element={
          <ProtectedRoutes allowedRoles={["MEMBER"]}>
            <CustomerLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<AccountInfo />} />
        <Route path="booking-history" element={<BookingHistory />} />
      </Route>

      {/* STAFF */}
      <Route
        path="/staff"
        element={
          <ProtectedRoutes allowedRoles={["STAFF"]}>
            <EmployeeLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="room-availability" element={<RoomAvailability />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoutes allowedRoles={["ADMIN"]}>
            <EmployeeLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<AdminDashBoard />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="room-availability" element={<RoomAvailability />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="room-types" element={<RoomTypeManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
        <Route path="service" element={<ServiceManagement />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
