import { useState, useCallback } from "react"
import type { MerchantFormValues } from "../../schemas/merchant.schema"

export type WizardStep = "welcome" | "basic-info" | "details" | "preview" | "success"

const STEP_ORDER: Record<WizardStep, number> = {
  welcome: 0,
  "basic-info": 1,
  details: 2,
  preview: 3,
  success: 4,
}

export function useMerchantWizard() {
  const [step, setStep] = useState<WizardStep>("welcome")
  const [formData, setFormData] = useState<Partial<MerchantFormValues>>({})

  const updateData = useCallback((data: Partial<MerchantFormValues>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const nextStep = useCallback(() => {
    setStep((prev) => {
      if (prev === "welcome") return "basic-info"
      if (prev === "basic-info") return "details"
      if (prev === "details") return "preview"
      if (prev === "preview") return "success"
      return prev
    })
  }, [])

  const prevStep = useCallback(() => {
    setStep((prev) => {
      if (prev === "basic-info") return "welcome"
      if (prev === "details") return "basic-info"
      if (prev === "preview") return "details"
      return prev
    })
  }, [])

  const reset = useCallback(() => {
    setStep("welcome")
    setFormData({})
  }, [])

  return {
    step,
    stepIndex: STEP_ORDER[step],
    totalSteps: Object.keys(STEP_ORDER).length,
    formData,
    updateData,
    nextStep,
    prevStep,
    reset,
  }
}
