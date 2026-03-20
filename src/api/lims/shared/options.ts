import { LabelValueOutput } from '../../admin/data-contracts'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'

export class BaseOptionsApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetCustomerOptions
   * @summary 获取客户选项
   * @request POST:/api/lims/option-list/get-customer-options
   * @secure
   */
  getCustomerOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-customer-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetEntrustHospitalOptions
   * @summary 获取委托医院选项
   * @request POST:/api/lims/option-list/get-entrust-hospital-options
   * @secure
   */
  getEntrustHospitalOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-entrust-hospital-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetExamPlanOptions
   * @summary 获取检查计划选项
   * @request POST:/api/lims/option-list/get-exam-plan-options
   * @secure
   */
  getExamPlanOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-exam-plan-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetItemOptions
   * @summary 获取项目选项
   * @request POST:/api/lims/option-list/get-item-options
   * @secure
   */
  getItemOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-item-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetPurposeOptions
   * @summary 获取目的选项
   * @request POST:/api/lims/option-list/get-purpose-options
   * @secure
   */
  getPurposeOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-purpose-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetSampleTypeOptions
   * @summary 获取样本类型选项
   * @request POST:/api/lims/option-list/get-sample-type-options
   * @secure
   */
  getSampleTypeOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-sample-type-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetDictOptions
   * @summary 获取字典选项
   * @request POST:/api/lims/option-list/get-dict-options
   * @secure
   */
  getDictOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-dict-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetAskRuleOptions
   * @summary 获取问询规则选项
   * @request POST:/api/lims/option-list/get-ask-rule-options
   * @secure
   */
  getAskRuleOptions = (data: GetPageInput<string>, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<LabelValueOutput[]>, any>({
      path: `/api/lims/option-list/get-ask-rule-options`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
