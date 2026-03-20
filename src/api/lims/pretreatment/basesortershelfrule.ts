import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseSorterShelfRuleOutput,
  BaseSorterShelfRuleListOutput,
  BaseSorterShelfRuleAddInput,
  BaseSorterShelfRuleUpdateInput,
  BaseSorterShelfRuleQueryListInput,
} from './datacontract/basesortershelfrule-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseSorterShelfRuleApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pretreatment/base-sorter-shelf-rule/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseSorterShelfRuleQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseSorterShelfRuleListOutput>, any>({
      path: `/api/pretreatment/base-sorter-shelf-rule/get-page`,
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
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pretreatment/base-sorter-shelf-rule/get-page
   * @secure
   */
  getList = (data: BaseSorterShelfRuleQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseSorterShelfRuleListOutput[]>, any>({
      path: `/api/pretreatment/base-sorter-shelf-rule/get-list`,
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
   * @summary 查询架子规则
   * @request GET:/api/pretreatment/base-sorter-shelf-rule/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseSorterShelfRuleOutput>, any>({
      path: `/api/pretreatment/base-sorter-shelf-rule/get`,
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
   * @summary 查询架子规则所有数据
   * @request GET:/api/pretreatment/base-sorter-shelf-rule/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseSorterShelfRuleOutput>>, any>({
      path: `/api/pretreatment/base-sorter-shelf-rule/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增架子规则
   * @request POST:/api/pretreatment/base-sorter-shelf-rule/add
   * @secure
   */
  add = (data: BaseSorterShelfRuleAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pretreatment/base-sorter-shelf-rule/add`,
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
   * @summary 修改架子规则
   * @request PUT:/api/pretreatment/base-sorter-shelf-rule/update
   * @secure
   */
  update = (data: BaseSorterShelfRuleUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pretreatment/base-sorter-shelf-rule/update`,
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
   * @summary 删除架子规则
   * @request DELETE:/api/pretreatment/base-sorter-shelf-rule/delete
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
      path: `/api/pretreatment/base-sorter-shelf-rule/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
