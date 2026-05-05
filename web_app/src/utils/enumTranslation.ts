// Tour Type translations
export const tourTypeTranslations: Record<string, string> = {
  ADVENTURE: 'Phiêu lưu',
  RELAX: 'Nghỉ dưỡng',
  FAMILY: 'Gia đình',
  LUXURY: 'Cao cấp',
  CULTURE: 'Văn hóa',
}

// Tour Status translations
export const tourStatusTranslations: Record<string, string> = {
  DRAFT: 'Bản nháp',
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngưng hoạt động',
}

// Tour Detail Status translations
export const tourDetailStatusTranslations: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  FULL: 'Đã kín',
  CANCELLED: 'Đã hủy',
}

// Price Type translations
export const priceTypeTranslations: Record<string, string> = {
  ADULT: 'Người lớn',
  CHILD: 'Trẻ em',
}

// Helper functions
export const getTourTypeLabel = (type: string): string => {
  return tourTypeTranslations[type] || type
}

export const getTourStatusLabel = (status: string): string => {
  return tourStatusTranslations[status] || status
}

export const getTourDetailStatusLabel = (status: string): string => {
  return tourDetailStatusTranslations[status] || status
}

export const getPriceTypeLabel = (type: string): string => {
  return priceTypeTranslations[type] || type
}

export const getTourTypeColor = (type: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    ADVENTURE: { bg: 'bg-red-50', text: 'text-red-700' },
    RELAX: { bg: 'bg-blue-50', text: 'text-blue-700' },
    FAMILY: { bg: 'bg-green-50', text: 'text-green-700' },
    LUXURY: { bg: 'bg-purple-50', text: 'text-purple-700' },
    CULTURE: { bg: 'bg-amber-50', text: 'text-amber-700' },
  }
  return colors[type] || { bg: 'bg-gray-50', text: 'text-gray-700' }
}

export const getTourStatusColor = (status: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    DRAFT: { bg: 'bg-amber-50', text: 'text-amber-700' },
    INACTIVE: { bg: 'bg-rose-50', text: 'text-rose-700' },
  }
  return colors[status] || { bg: 'bg-slate-50', text: 'text-slate-700' }
}

export const getTourDetailStatusColor = (status: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    FULL: { bg: 'bg-orange-50', text: 'text-orange-700' },
    CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700' },
  }
  return colors[status] || { bg: 'bg-slate-50', text: 'text-slate-700' }
}
