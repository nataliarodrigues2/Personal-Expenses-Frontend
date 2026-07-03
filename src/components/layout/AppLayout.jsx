import Sidebar from './Sidebar'
import MobileTopBar from './MobileTopBar'
import MobileTabBar from './MobileTabBar'

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  )
}
