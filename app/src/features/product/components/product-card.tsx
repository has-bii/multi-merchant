import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate, formatPrice } from "@/lib/format"
import type { ProductListItem } from "@/features/product/queries/product.queries"

interface ProductCardProps {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.productHet.name}</CardTitle>
        <CardDescription>{product.merchant.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Harga Anda</span>
            <span className="font-semibold">{formatPrice(product.price)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>HET</span>
            <span className="line-through">{formatPrice(product.productHet.price)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Ditambahkan {formatDate(product.createdAt)}
      </CardFooter>
    </Card>
  )
}
