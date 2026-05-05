import { useRef, useState } from 'react'
import type { TourCreateTourDraft } from '../../../../types/tour/tour-create.type'

interface TourCreateMediaCardProps {
  value: Pick<TourCreateTourDraft, 'imageUrl' | 'gallery'>
  onChange: (patch: Partial<Pick<TourCreateTourDraft, 'imageUrl' | 'gallery'>>) => void
  onUploadImage: (file: File) => void | Promise<void>
  onUploadGallery: (files: File[]) => void | Promise<void>
  uploadingImage?: boolean
  uploadingGallery?: boolean
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function TourCreateMediaCard({
  value,
  onChange,
  onUploadImage,
  onUploadGallery,
  uploadingImage = false,
  uploadingGallery = false,
}: TourCreateMediaCardProps) {
  const [galleryInput, setGalleryInput] = useState('')
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

  const addGalleryItem = () => {
    const nextValue = galleryInput.trim()
    if (!nextValue) return
    onChange({ gallery: [...value.gallery, nextValue] })
    setGalleryInput('')
  }

  const removeGalleryItem = (index: number) => {
    onChange({ gallery: value.gallery.filter((_, currentIndex) => currentIndex !== index) })
  }

  const handleUploadCover = async (file?: File | null) => {
    if (!file) return
    await onUploadImage(file)
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
  }

  const handleUploadGallery = async (files?: FileList | File[] | null) => {
    
    const nextFiles = Array.from(files ?? []).filter(Boolean)
    if (nextFiles.length === 0) return
    await onUploadGallery(nextFiles)
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Hình ảnh</h2>
        <p className="text-sm text-slate-500">Dùng ảnh bìa và thư viện ảnh để làm tour nổi bật hơn.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ảnh bìa</label>
          <div className="flex gap-2">
            <input
              value={value.imageUrl}
              onChange={(event) => onChange({ imageUrl: event.target.value })}
              className={inputClass}
              placeholder="Dán URL ảnh hoặc tải ảnh lên"
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingImage}
              className="shrink-0 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingImage ? 'Đang tải...' : 'Tải ảnh'}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void handleUploadCover(event.target.files?.[0])
              }}
            />
          </div>
          {value.imageUrl && <img src={value.imageUrl} alt="Ảnh bìa tour" className="mt-3 h-44 w-full rounded-2xl object-cover" />}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Thư viện ảnh</label>
            <span className="text-xs text-slate-400">{value.gallery.length} ảnh</span>
          </div>

          <div className="flex gap-2">
            <input
              value={galleryInput}
              onChange={(event) => setGalleryInput(event.target.value)}
              className={inputClass}
              placeholder="Dán link ảnh rồi nhấn Thêm"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addGalleryItem()
                }
              }}
            />
            <button
              type="button"
              onClick={addGalleryItem}
              className="shrink-0 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploadingGallery}
              className="shrink-0 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingGallery ? 'Đang tải...' : 'Tải ảnh'}
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void handleUploadGallery(event.target.files)
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {value.gallery.length === 0 ? (
              <div className="col-span-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Chưa có ảnh thư viện
              </div>
            ) : (
              value.gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    className="absolute right-2 top-2 rounded-full bg-slate-900/70 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}