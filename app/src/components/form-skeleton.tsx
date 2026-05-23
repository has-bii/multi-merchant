import { Field, FieldGroup } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  inputCount: number
}

export function FormSkeleton({ inputCount }: Props) {
  return (
    <FieldGroup>
      {Array.from({ length: inputCount }).map((_, index) => (
        <Field key={index}>
          <Skeleton className="h-8 w-20!" />
          <Skeleton className="h-8 w-full" />
        </Field>
      ))}
      <Field>
        <Skeleton className="h-9 w-full" />
      </Field>
    </FieldGroup>
  )
}
