import { LabelValueOutput } from '/@/api/admin/data-contracts'

export enum InputTypeEnum {
  Info = 1,
  Item = 2,
  DirectInput = 3,
}
export enum InputOrderEnum {
  First = 1,
  Second = 2,
}
/**
 * 录入检测项目选项
 */
export interface TestItemOption {
  purCode: string | null
  purName: string | null
  groupCode: string | null
  groupName: string | null
  purNameAB: string | null
  purNameEN: string | null
  sampleTypeCode: string | null
  sampleTypeName: string | null
  isCombo: boolean
  comboName: string | null
  comboCode: string | null
  sampleTypeList: LabelValueOutput[]
}

/**
 * 录入信息
 */
export interface InputInfoDto {
  /**
   * 条码
   */
  barcode: string

  /**
   * 姓名
   */
  patientName: string

  /**
   * 性别代码
   */
  genderCode: string | null

  /**
   * 性别
   */
  genderName: string | null

  /**
   * 年龄1
   */
  age1: string | null

  /**
   * 年龄单位代码1
   */
  ageUnit1: string | null

  /**
   * 年龄单位1
   */
  ageUnitName1: string | null

  /**
   * 年龄2
   */
  age2: string | null

  /**
   * 年龄单位代码2
   */
  ageUnit2: string | null

  /**
   * 年龄单位2
   */
  ageUnitName2: string | null

  /**
   * 加急
   */
  isUrgent: number // 对应 C# int

  /**
   * 科室
   */
  department: string | null

  /**
   * 病区
   */
  ward: string | null

  /**
   * 医生
   */
  doctor: string | null

  /**
   * 床号
   */
  bedNo: string | null

  /**
   * 病员号
   */
  patientId: string | null

  /**
   * 客户条码
   */
  customerBarcode: string | null

  /**
   * 采集时间
   */
  collectTime: Date

  /**
   * 送检类型代码
   */
  patientTypeCode: string | null

  /**
   * 送检类型
   */
  patientTypeName: string | null

  /**
   * 电话
   */
  phone: string | null

  /**
   * 备注
   */
  remark: string | null
}

/**
 * 录入保存实体
 */
export interface InputSaveDto {
  inputOrder: InputOrderEnum
  inputType: InputTypeEnum
  inputInfo: InputInfoDto
  inputItems: Array<TestItemOption>
}

export interface InputSaveSuccessOutput {
  id: number
  barcode: string
  patientName: string
}
