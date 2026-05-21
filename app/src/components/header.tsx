import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import type { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

// ── Header ──

interface HeaderProps {
  children: React.ReactNode
  className?: string
}

export function Header({ children, className }: HeaderProps) {
  return (
    <div
      className={cn(
        "grid h-16 grid-cols-3 items-center gap-2 border-b px-4 py-3 @lg/main:flex",
        className,
      )}
    >
      {children}
    </div>
  )
}

// ── HeaderLeft ──

interface HeaderLeftProps {
  children: React.ReactNode
  className?: string
}

export function HeaderLeft({ children, className }: HeaderLeftProps) {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>
}

// ── HeaderCenter ──

interface HeaderCenterProps {
  children?: React.ReactNode
  className?: string
}

export function HeaderCenter({ children, className }: HeaderCenterProps) {
  return <div className={cn("flex items-center justify-center", className)}>{children}</div>
}

// ── HeaderRight ──

interface HeaderRightProps {
  children?: React.ReactNode
  className?: string
}

export function HeaderRight({ children, className }: HeaderRightProps) {
  return <div className={cn("flex items-center justify-end gap-2", className)}>{children}</div>
}

// ── HeaderTitle ──

interface HeaderTitleProps {
  children: React.ReactNode
  className?: string
}

export function HeaderTitle({ children, className }: HeaderTitleProps) {
  return <h1 className={cn("text-sm font-medium whitespace-nowrap", className)}>{children}</h1>
}

// ── HeaderBack ──

interface HeaderBackProps<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown> {
  linkOptions: ValidateLinkOptions<TRouter, TOptions>
  className?: string
}

export function HeaderBack<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
>({ linkOptions, className }: HeaderBackProps<TRouter, TOptions>) {
  return (
    <Button variant="ghost" size="icon-lg" className={cn("-ml-1", className)} asChild>
      <Link {...linkOptions}>
        <ChevronLeft className="size-6!" strokeWidth={2} />
      </Link>
    </Button>
  )
}

// ── HeaderBreadcrumb ──

interface HeaderBreadcrumbProps {
  items: Array<{ label: string; to?: string }>
  className?: string
}

export function HeaderBreadcrumb({ items, className }: HeaderBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.to ?? "#"}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
