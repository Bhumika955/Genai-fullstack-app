import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';

function RootLayout() {
  return (
    <>
      <Navbar />
      <ThemeToggle />
      <Outlet />
    </>
  );
}

export default RootLayout;