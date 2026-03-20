import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseAuditRuleOutput,
  BaseAuditRuleListOutput,
  BaseAuditRuleAddInput,
  BaseAuditRuleUpdateInput,
  BaseAuditRuleQueryListInput,
  TestRuleInput,
  TestRuleResultDto,
} from './datacontract/auditrule-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseAuditRuleApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-audit-rule/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseAuditRuleQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseAuditRuleListOutput>, any>({
      path: `/api/lims/base-audit-rule/get-page`,
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
   * @name Get
   * @summary 查询审核规则
   * @request GET:/api/lims/base-audit-rule/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseAuditRuleOutput>, any>({
      path: `/api/lims/base-audit-rule/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetAll
   * @summary 查询审核规则所有数据
   * @request GET:/api/lims/base-audit-rule/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseAuditRuleOutput>>, any>({
      path: `/api/lims/base-audit-rule/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增审核规则
   * @request POST:/api/lims/base-audit-rule/add
   * @secure
   */
  add = (data: BaseAuditRuleAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-audit-rule/add`,
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
   * @name Update
   * @summary 修改审核规则
   * @request PUT:/api/lims/base-audit-rule/update
   * @secure
   */
  update = (data: BaseAuditRuleUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-audit-rule/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Delete
   * @summary 删除审核规则
   * @request DELETE:/api/lims/base-audit-rule/delete
   * @secure
   */
  delete = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-audit-rule/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name TestRule
   * @summary 测试规则
   * @request POST:/api/lims/base-audit-rule/test-rule
   * @secure
   */
  testRule = (data: TestRuleInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<TestRuleResultDto>, any>({
      path: `/api/lims/base-audit-rule/test-rule`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
