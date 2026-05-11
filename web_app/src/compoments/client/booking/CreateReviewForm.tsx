import { useState } from 'react'
import { toast } from 'react-toastify'
import { create } from '../../../api/tour/review.api'
import { uploadImage } from '../../../api/tour/tour.api'
import type { ReviewRequest } from '../../../types/tour/review.type'

type Props = {
  tourId: string
  tourName: string
  onSuccess?: () => void
}

const ratingOptions = [1, 2, 3, 4, 5]

export default function CreateReviewForm({ tourId, tourName, onSuccess }: Props) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const isValid = rating >= 1 && rating <= 5 && content.trim().length > 0

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    try {
      setUploading(true)
      const response = await uploadImage(file)
      if (response.code === 200 && response.data?.url) {
        setImageUrl(response.data.url)
        toast.success('Tải ảnh lên thành công')
      } else {
        toast.error(response.message || 'Không thể tải ảnh lên')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Lỗi tải ảnh'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      toast.warning('Vui lòng nhập đánh giá và nội dung')
      return
    }

    try {
      setLoading(true)

      const payload: ReviewRequest = {
        rating,
        content: content.trim(),
        ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
      }

      const response = await create(tourId, payload)

      if (response.code !== 200) {
        toast.error(response.message || 'Không thể gửi đánh giá')
        return
      }

      toast.success('Đánh giá của bạn đã được gửi')
      setRating(5)
      setContent('')
      setImageUrl('')
      onSuccess?.()
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
        return
      }
      
      const message = err.message || 'Lỗi kết nối đến server'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">
        Đánh giá tour: {tourName}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Đánh giá (sao)</label>
          <div className="mt-2 flex gap-2">
            {ratingOptions.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={loading}
                className={`flex-1 rounded-lg border-2 px-3 py-2 text-center font-semibold transition ${
                  rating === star
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {star}⭐
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700">
            Nội dung đánh giá
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
            rows={4}
          />
          <p className="mt-1 text-xs text-slate-500">
            {content.length} ký tự
          </p>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-700">
            Hình ảnh (tuỳ chọn)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading || uploading}
            className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200 disabled:opacity-50"
          />
          {imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                disabled={loading || uploading}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Xóa
              </button>
            </div>
          )}
          {uploading && <p className="mt-1 text-xs text-blue-600">Đang tải ảnh...</p>}
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              setRating(5)
              setContent('')
              setImageUrl('')
            }}
            disabled={loading || uploading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            disabled={loading || uploading || !isValid}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </section>
  )
}
