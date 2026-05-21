import { Header, HeaderCenter, HeaderLeft, HeaderRight } from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" disabled>
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-8 flex-1" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="size-8 rounded-lg" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <MainPage>
          <Header>
            <HeaderLeft>
              <Skeleton className="h-9 w-9 rounded-md @lg/main:hidden" />
              <Skeleton className="hidden h-8 w-32 @lg/main:flex" />
            </HeaderLeft>
            <HeaderCenter className="@lg/main:hidden">
              <Skeleton className="h-8 w-full" />
            </HeaderCenter>
          </Header>

          <MainPageContent>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-9 w-64" />
              <div className="inline-flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Skeleton className="h-64 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-32 flex-1" />
                <Skeleton className="h-32 flex-1" />
                <Skeleton className="h-32 flex-1" />
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          </MainPageContent>
        </MainPage>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function PageContentSkeleton() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <Skeleton className="h-9 w-9 rounded-md @lg/main:hidden" />
          <Skeleton className="hidden h-8 w-32 @lg/main:flex" />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <Skeleton className="h-8 w-full" />
        </HeaderCenter>
      </Header>

      <MainPageContent>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-64" />
          <div className="inline-flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-64 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-32 flex-1" />
            <Skeleton className="h-32 flex-1" />
            <Skeleton className="h-32 flex-1" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </MainPageContent>
    </MainPage>
  )
}
