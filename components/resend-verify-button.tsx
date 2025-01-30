'use client'

export function ResendVerifyButton() {
  const handleSubmit = async () => {
    console.log('click')
  }

  return (
    <button type="button" className="underline" onClick={handleSubmit}>
      Click to resend
    </button>
  )
}
