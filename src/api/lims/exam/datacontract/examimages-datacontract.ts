/**
 * 查询检验图片列表入参
 */
export interface ExamImagesQueryListInput {}
/**
 * 新增检验图片入参
 */
export interface ExamImagesAddInput {
  examInfoId?: number | null
  fileName?: string | null
  fileUrl?: string | null
  zoomCode?: string | null
  zoomName?: string | null
  antiBodyCode?: string | null
  antiBodyName?: string | null
  isShow?: boolean | null
  sort?: number
  ismodifled?: boolean | null
}
/**
 * 更新检验图片入参
 */
export interface ExamImagesUpdateInput extends ExamImagesAddInput {
  id: number
}
/**
 * 获取单个检验图片返回
 */
export interface ExamImagesOutput extends ExamImagesUpdateInput {
  // isEditing: boolean
  antiBodyEditing?: boolean
  zoomEditing?: boolean
  isShowEditing?: boolean

  originalAntiCode?: string | null
  originalZoomCode?: string | null
  originalIsShow?: boolean | null
}

/**
 * 获取检验图片列表返回
 */
export interface ExamImagesListOutput extends ExamImagesOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}
