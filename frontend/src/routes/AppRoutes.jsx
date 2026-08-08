import Home from '../pages/Home.jsx'
import Projects from '../pages/Projects.jsx'
import AdminDashboard from '../pages/AdminDashboard.jsx'
import Notes from '../pages/Notes.jsx'

const routes = {
  '/projects': Projects,
  '/admin-dashboard': AdminDashboard,
  '/notes': Notes,
}

export default function AppRoutes() {
  const Page = window.location.pathname.startsWith('/notes/') ? Notes : routes[window.location.pathname] ?? Home
  return <Page />
}
