import { Link, useLocation } from "react-router"
import {
    ArrowLeftRight,
    CircleUser,
    CreditCard,
    LayoutDashboard,
    Tags,
    Target,
    TrendingUp,
    Wallet,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar"

const groups = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", url: "/Dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "Planning",
        items: [
            { title: "Buckets", url: "/Buckets", icon: Wallet },
            { title: "Categories", url: "/Categories", icon: Tags },
        ],
    },
    {
        label: "Transaction History",
        items: [
            { title: "Transactions", url: "/Transactions", icon: ArrowLeftRight },
            { title: "Income", url: "/Income", icon: TrendingUp },
        ],
    },
    {
        label: "Savings Goals and Debts",
        items: [
            { title: "Savings Goals", url: "/SavingsGoals", icon: Target },
            { title: "Debts", url: "/Debts", icon: CreditCard },
        ],
    },
]

export default function AppSidebar() {
    const { pathname } = useLocation()

    return (
        <Sidebar variant="inset" side="left" collapsible="offcanvas">
            <SidebarHeader>
                <span className="px-2 py-1 text-lg font-semibold">Jot</span>
            </SidebarHeader>

            <SidebarContent>
                {groups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            isActive={pathname === item.url}
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
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            isActive={pathname === "/User"}
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
