import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseSortRuleOutput,
  BaseSortRuleListOutput,
  BaseSortRuleAddInput,
  BaseSortRuleUpdateInput,
  BaseSortRuleQueryListInput,
} from './datacontract/sortrule-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseSortRuleApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pretreatment/base-sort-rule/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseSortRuleQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseSortRuleListOutput>, any>({
      path: `/api/pretreatment/base-sort-rule/get-page`,
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
   * @summary 查询分拣规则
   * @request GET:/api/pretreatment/base-sort-rule/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseSortRuleOutput>, any>({
      path: `/api/pretreatment/base-sort-rule/get`,
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
   * @summary 查询分拣规则所有数据
   * @request GET:/api/pretreatment/base-sort-rule/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseSortRuleOutput>>, any>({
      path: `/api/pretreatment/base-sort-rule/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增分拣规则
   * @request POST:/api/pretreatment/base-sort-rule/add
   * @secure
   */
  add = (data: BaseSortRuleAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pretreatment/base-sort-rule/add`,
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
   * @summary 修改分拣规则
   * @request PUT:/api/pretreatment/base-sort-rule/update
   * @secure
   */
  update = (data: BaseSortRuleUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pretreatment/base-sort-rule/update`,
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
   * @summary 删除分拣规则
   * @request DELETE:/api/pretreatment/base-sort-rule/delete
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
      path: `/api/pretreatment/base-sort-rule/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
