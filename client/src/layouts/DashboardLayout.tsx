import { Outlet } from 'react-router-dom'

type Props = {}

export default function DashboardLayout({ }: Props) {
  return (
    <div>
      <Outlet />
    </div>
  )
}