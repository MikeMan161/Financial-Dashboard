import { Link, useLocation } from "react-router"
import {
    ArrowLeftRight,
    CircleUser,
    LayoutDashboard,
    Target,
    Wallet,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar"
import Logo from "./Logo"

// Flat rather than grouped: at four destinations, group headings label one or two
// items each and cost more space than they save. Categories live inside the
// Transactions page, and Income is a profile field on the account page until it
// becomes a domain of its own.
const items = [
    { title: "Dashboard", url: "/Dashboard", icon: LayoutDashboard },
    { title: "Buckets", url: "/Buckets", icon: Wallet },
    { title: "Transactions", url: "/Transactions", icon: ArrowLeftRight },
    { title: "Goals & Debts", url: "/GoalsAndDebts", icon: Target },
]

export default function AppSidebar() {
    const { pathname } = useLocation()

    // Section match, not exact match: /Transactions/:bucketId should still light
    // up Transactions. The trailing slash keeps /Debts from matching /DebtsFoo.
    function isActive(url: string) {
        return pathname === url || pathname.startsWith(`${url}/`)
    }

    return (
        <Sidebar variant="inset" side="left" collapsible="offcanvas">
            <SidebarHeader>
                <Logo className="px-2 py-1" />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        isActive={isActive(item.url)}
                                        render={<Link to={item.url} />}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            isActive={isActive("/User")}
                            render={<Link to="/User" />}
                        >
                            <CircleUser />
                            <span>Account</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
