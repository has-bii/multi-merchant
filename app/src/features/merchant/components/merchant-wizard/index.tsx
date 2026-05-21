import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { merchantKeys, useCreateMerchantMutation } from "../../queries/merchant.queries"
import type { MerchantFormValues } from "../../schemas/merchant.schema"
import { StepBasicInfo } from "./step-basic-info"
import { StepDetails } from "./step-details"
import { StepPreview } from "./step-preview"
import { StepSuccess } from "./step-success"
import { StepWelcome } from "./step-welcome"
import { useMerchantWizard } from "./use-merchant-wizard"

export function MerchantCreationWizard() {
  const wizard = useMerchantWizard()
  const createMutation = useCreateMerchantMutation()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setError(null)
    try {
      await createMutation.mutateAsync(wizard.formData)
      wizard.nextStep()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat merchant")
    }
  }

  const handleFinish = () => {
    queryClient.invalidateQueries({ queryKey: merchantKeys.byUser() })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 pt-6">
          {wizard.step !== "welcome" && wizard.step !== "success" && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>
                  Langkah {wizard.stepIndex} / {wizard.totalSteps - 2}
                </span>
              </div>
              <Progress
                value={
                  wizard.step === "preview"
                    ? 100
                    : (wizard.stepIndex / (wizard.totalSteps - 2)) * 100
                }
              />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
              {error}
            </div>
          )}

          {wizard.step === "welcome" && <StepWelcome onNext={wizard.nextStep} />}
          {wizard.step === "basic-info" && (
            <StepBasicInfo
              data={wizard.formData}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onPrev={wizard.prevStep}
            />
          )}
          {wizard.step === "details" && (
            <StepDetails
              data={wizard.formData}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onPrev={wizard.prevStep}
            />
          )}
          {wizard.step === "preview" && (
            <StepPreview
              data={wizard.formData}
              onConfirm={handleConfirm}
              onPrev={wizard.prevStep}
              isPending={createMutation.isPending}
            />
          )}
          {wizard.step === "success" && <StepSuccess onFinish={handleFinish} />}
        </CardContent>
      </Card>
    </div>
  )
}
