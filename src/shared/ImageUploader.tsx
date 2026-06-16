import { useState } from 'react'
import api from '../api/axiosInstance'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
  folder?: string
  max?: number
}

interface CloudinaryResponse {
  secure_url: string
  public_id: string
}

function publicIdDesdeUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/)
  return match ? match[1] : null
}

export function ImageUploader({ value, onChange, folder = 'foodstore', max }: Props) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (max !== undefined && value.length >= max) {
      setError(`Máximo ${max} imagen${max === 1 ? '' : 'es'}.`)
      event.target.value = ''
      return
    }
    setSubiendo(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const { data } = await api.post<CloudinaryResponse>('/uploads/imagen', formData)
      onChange([...value, data.secure_url])
    } catch {
      setError('No se pudo subir la imagen.')
    } finally {
      setSubiendo(false)
      event.target.value = ''
    }
  }

  const handleRemove = async (url: string) => {
    const publicId = publicIdDesdeUrl(url)
    if (publicId) {
      try {
        await api.delete(`/uploads/imagen/${publicId}`)
      } catch {
        setError('No se pudo eliminar de Cloudinary, se quitó de la lista.')
      }
    }
    onChange(value.filter((u) => u !== url))
  }

  const alcanzoMaximo = max !== undefined && value.length >= max

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="w-16 h-16 object-cover rounded border border-border" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 text-xs leading-none cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!alcanzoMaximo && (
        <label className="text-xs text-info cursor-pointer w-fit">
          {subiendo ? 'Subiendo...' : '+ Subir imagen'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            disabled={subiendo}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
