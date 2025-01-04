import { useCallback, useState } from 'react'
import { toast } from "sonner"

type CopiedValue = string | null

type CopyFn = (text: string) => Promise<boolean>

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = useCallback(async text => {
    if (!navigator?.clipboard) {
      toast('Clipboard not supported')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      toast('Copied!')
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      toast('Failed to copy!')
      setCopiedText(null)
      return false
    }
  }, [])

  return [copiedText, copy]
}