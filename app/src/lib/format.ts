import { format } from "date-fns"
import { id } from "date-fns/locale"

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

const idrNumberFormatter = new Intl.NumberFormat("id-ID")

/** Format number to locale string without currency (e.g. 100000 → "100.000") */
export function formatPriceString(price: number): string {
  return idrNumberFormatter.format(price)
}

/** Parse locale-formatted string back to number (e.g. "100.000" → 100000) */
export function formatPriceNumber(formatted: string): number {
  return Number(formatted.replace(/\D/g, ""))
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return format(date, "HH:mm 'WIB', d MMM yyyy", { locale: id })
}
