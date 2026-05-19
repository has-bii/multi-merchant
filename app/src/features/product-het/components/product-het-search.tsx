import { useEffect, useState } from "react"

import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProductHetSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function ProductHetSearchInput({
  value,
  onChange,
}: ProductHetSearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync local value when URL param changes externally
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce: update URL after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, value, onChange])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Cari produk..."
        className="pl-8 pr-8"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => {
            setLocalValue("")
            onChange("")
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Hapus pencarian</span>
        </Button>
      )}
    </div>
  )
}
