import { NavUser } from "@/components/nav-user"
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
  SidebarRail,
} from "@/components/ui/sidebar"

import { Link, useLocation } from "@tanstack/react-router"
import { BoxesIcon, Building2, LayoutDashboard, Package } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    url: "/user",
    icon: LayoutDashboard,
  },
  {
    title: "Merchant",
    url: "/user/merchant",
    icon: Building2,
  },
  {
    title: "Products",
    url: "/user/produk",
    icon: Package,
  },
]

export function UserSidebar() {
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/user">
                <div className="bg-primary text-primary-foreground inline-flex size-8 items-center justify-center rounded-lg">
                  <BoxesIcon />
                </div>
                <span className="font-semibold">Multi Merchant</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
