import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

/**
 * Handles Instagram image upload functionality:
 * 1. Image selection and preview
 * 2. File validation and size checks
 * 3. Upload to Supabase storage
 * 4. Publishing to Instagram via API
 * 
 * Flow:
 * - User selects image and adds caption
 * - Image is uploaded to Supabase storage
 * - Public URL is sent to backend
 * - Backend publishes to Instagram
 */
export default function ImageUpload() {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) { // 8MB limit
        setError('Image size should be less than 8MB')
        return
      }
      setSelectedImage(file)

      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleUpload = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!selectedImage) {
        throw new Error('Please select an image')
      }


      const fileExt = selectedImage.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('instagram-uploads')
        .upload(filePath, selectedImage)

      if (uploadError) throw uploadError


      const { data: { publicUrl } } = supabase.storage
        .from('instagram-uploads')
        .getPublicUrl(filePath)


      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instagram/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          imageUrl: publicUrl,
          caption,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.details || responseData.error || 'Failed to upload image')
      }

      setSuccess('Image successfully posted to Instagram!')
      setSelectedImage(null)
      setPreviewUrl(null)
      setCaption('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="image-upload-container">
      <h3>Upload to Instagram</h3>
      
      <div className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
          className="file-input"
        />
        
        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="caption-input"
        />
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <button
          onClick={handleUpload}
          disabled={!selectedImage || loading}
          className="upload-btn"
        >
          {loading ? 'Uploading...' : 'Post to Instagram'}
        </button>
      </div>
    </div>
  )
} 