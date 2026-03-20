import { AxiosResponse } from 'axios'
import {
  BaseAskRuleAddInput,
  BaseAskRuleDetailAddInput,
  BaseAskRuleDetailOutput,
  BaseAskRuleDetailQueryInput,
  BaseAskRuleDetailUpdateInput,
  BaseAskRuleOutput,
  BaseAskRuleQueryInput,
  BaseAskRuleUpdateInput,
} from './datacontract/askrule-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '/@/api/lims/basedata/datacontract/base'

export class BaseAskRuleApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-ask-rule/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseAskRuleQueryInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseAskRuleOutput>, any>({
      path: `/api/lims/base-ask-rule/get-page`,
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
   * @summary 查询问询规则
   * @request GET:/api/lims/base-ask-rule/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseAskRuleOutput>, any>({
      path: `/api/lims/base-ask-rule/get`,
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
   * @summary 查询问询规则所有数据
   * @request GET:/api/lims/base-ask-rule/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseAskRuleOutput>>, any>({
      path: `/api/lims/base-ask-rule/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增问询规则
   * @request POST:/api/lims/base-ask-rule/add
   * @secure
   */
  add = (data: BaseAskRuleAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-ask-rule/add`,
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
   * @summary 修改问询规则
   * @request PUT:/api/lims/base-ask-rule/update
   * @secure
   */
  update = (data: BaseAskRuleUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-ask-rule/update`,
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
   * @summary 删除问询规则
   * @request DELETE:/api/lims/base-ask-rule/delete
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
      path: `/api/lims/base-ask-rule/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

export class BaseAskRuleDetailApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-ask-rule-detail/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseAskRuleDetailQueryInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseAskRuleDetailOutput>, any>({
      path: `/api/lims/base-ask-rule-detail/get-page`,
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
   * @summary 查询问询规则明细
   * @request GET:/api/lims/base-ask-rule-detail/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseAskRuleDetailOutput>, any>({
      path: `/api/lims/base-ask-rule-detail/get`,
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
   * @summary 查询问询规则明细所有数据
   * @request GET:/api/lims/base-ask-rule-detail/getAll
   * @secure
   */
  getAll = (
    query?: {
      /** @format String */
      askRuleCode?: string | null
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<BaseAskRuleDetailOutput>>, any>({
      path: `/api/lims/base-ask-rule-detail/get-all`,
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
   * @name Add
   * @summary 新增问询规则明细
   * @request POST:/api/lims/base-ask-rule-detail/add
   * @secure
   */
  add = (data: BaseAskRuleDetailAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-ask-rule-detail/add`,
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
   * @summary 修改问询规则明细
   * @request PUT:/api/lims/base-ask-rule-detail/update
   * @secure
   */
  update = (data: BaseAskRuleDetailUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-ask-rule-detail/update`,
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
   * @summary 删除问询规则明细
   * @request DELETE:/api/lims/base-ask-rule-detail/delete
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
      path: `/api/lims/base-ask-rule-detail/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}
