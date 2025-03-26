"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface UseUndoOptions<T> {
  initialState: T
  onUndo?: (previousState: T) => void
  toastMessage?: {
    title: string
    description?: string
  }
}

export function useUndo<T>({
  initialState,
  onUndo,
  toastMessage = {
    title: "Action completed",
    description: "Your changes have been saved.",
  },
}: UseUndoOptions<T>) {
  const [state, setState] = useState<T>(initialState)
  const [previousState, setPreviousState] = useState<T | null>(null)
  const { toast } = useToast()

  const updateState = useCallback(
    (newState: T) => {
      setPreviousState(state)
      setState(newState)

      toast({
        title: toastMessage.title,
        description: toastMessage.description,
        action: previousState !== null && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (previousState) {
                setState(previousState)
                if (onUndo) {
                  onUndo(previousState)
                }
                toast({
                  title: "Action undone",
                  description: "Your previous state has been restored.",
                })
              }
            }}
          >
            Undo
          </Button>
        ),
      })
    },
    [state, previousState, toast, toastMessage, onUndo],
  )

  return [state, updateState] as const
}

