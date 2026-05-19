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

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return format(date, "HH:mm 'WIB', d MMM yyyy", { locale: id })
}
