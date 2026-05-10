import { Outlet } from 'react-router-dom'
import Header from '../compoments/Header'
import Footer from '../compoments/Footer.tsx'

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleMobileSidebar={() => {}} />

      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
