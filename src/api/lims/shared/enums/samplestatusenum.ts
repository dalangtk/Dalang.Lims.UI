/**
 * 样本状态枚举
 */
export const SampleStatus = {
  /** 初始 */
  Init: 1001,
  /** 确认 */
  Confirmed: 1011,
  /** 待分血 */
  WaitSplitBlood: 1021,
  /** 已分血 */
  SplitBlood: 1031,
  /** 分拣完成 */
  Sorted: 1041,
  /** 已交接 */
  Handovered: 1051,
  /** 检验中 */
  Testing: 1061,
  /** 初审 */
  FirstCheck: 1071,
  /** 复审 */
  SecondCheck: 1081,
  /** 已报告 */
  Reported: 1091,
  /** 已打印 */
  Printed: 1101,
  /** 取消报告 */
  ReportCancel: 1111,
  /** 报告延迟 */
  ReportDelay: 1121,
} as const

export type SampleStatusEnum = (typeof SampleStatus)[keyof typeof SampleStatus]

// 枚举描述
export const SampleStatusDescriptions: Record<SampleStatusEnum, string> = {
  [SampleStatus.Init]: '初始',
  [SampleStatus.Confirmed]: '确认',
  [SampleStatus.WaitSplitBlood]: '待分血',
  [SampleStatus.SplitBlood]: '已分血',
  [SampleStatus.Sorted]: '已分拣',
  [SampleStatus.Handovered]: '已交接',
  [SampleStatus.Testing]: '检验中',
  [SampleStatus.FirstCheck]: '初审',
  [SampleStatus.SecondCheck]: '复审',
  [SampleStatus.Reported]: '已报告',
  [SampleStatus.Printed]: '已打印',
  [SampleStatus.ReportCancel]: '取消报告',
  [SampleStatus.ReportDelay]: '报告延迟',
}

// 扩展工具函数
export const SampleStatusUtils = {
  getDescription: (status: SampleStatusEnum): string => {
    return SampleStatusDescriptions[status]
  },

  getAllOptions: (): Array<{ code: number; name: string }> => {
    return Object.entries(SampleStatusDescriptions).map(([value, name]) => ({
      code: Number(value),
      name,
    }))
  },
  getSampleStatus: (value: any): SampleStatusEnum => {
    return Object.values(SampleStatus).find((status) => status === value)!
  },
}
/**
 * 获取样本状态值，如果无效则返回 undefined
 * @param value 输入值
 * @returns 对应的 SampleStatusEnum 值或 undefined
 */
// export const getSampleStatus(value: any): SampleStatusEnum | undefined {
//   return Object.values(SampleStatus).find(status => status === value);
// }

const SampleStatusColor: Record<SampleStatusEnum, string> = {
  [SampleStatus.Init]: 'white',
  [SampleStatus.Confirmed]: 'white',
  [SampleStatus.WaitSplitBlood]: 'red',
  [SampleStatus.SplitBlood]: 'darkred',
  [SampleStatus.Sorted]: '#FA8072',
  [SampleStatus.Handovered]: '#DA70D6',
  [SampleStatus.Testing]: 'white',
  [SampleStatus.FirstCheck]: 'pink',
  [SampleStatus.SecondCheck]: '#87CEEB', //success
  [SampleStatus.Reported]: '#8FBC8F',
  [SampleStatus.Printed]: '#ADFF2F',
  [SampleStatus.ReportCancel]: '#A9A9A9',
  [SampleStatus.ReportDelay]: '#D2B48C',
}

export const GetStatusColor = (status: SampleStatusEnum): string => {
  return SampleStatusColor[status] || 'white' // 增加兜底值防止运行时报错
}
