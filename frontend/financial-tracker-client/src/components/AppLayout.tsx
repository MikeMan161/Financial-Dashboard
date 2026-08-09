import { Outlet } from "react-router"
import { SidebarProvider, SidebarInset, SidebarTrigger } from './ui/sidebar'
import AppSidebar from "./AppSidebar"

export default function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}