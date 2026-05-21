import { getMerchantDetailQueryOptions } from "@/features/merchant/queries/merchant.queries"
import { formatDate } from "@/lib/format"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"

interface MerchantDetailContentProps {
  id: string
}

export function MerchantDetailContent({ id }: MerchantDetailContentProps) {
  const { data } = useSuspenseQuery(getMerchantDetailQueryOptions(id))

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight capitalize">{data.name}</h2>
        {data.description && (
          <p className="text-muted-foreground">{data.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-4 text-muted-foreground" />
          <span>{data.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 text-muted-foreground" />
          <span>{data.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-4 text-muted-foreground" />
          <span>Dibuat {formatDate(data.createdAt)}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-3">Informasi Pemilik</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 text-muted-foreground" />
            <span>{data.user.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span>{data.user.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
