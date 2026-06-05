import { AxiosResponse } from 'axios'
import {
  BasePathologySampleTypeAddInput,
  BasePathologySampleTypeListOutput,
  BasePathologySampleTypeOutput,
  BasePathologySampleTypeQueryListInput,
  BasePathologySampleTypeUpdateInput,
} from './datacontract/pathologysampletype-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '/@/api/lims/basedata/datacontract/base'

export class BasePathologySampleTypeApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-sample-type/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePathologySampleTypeQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologySampleTypeListOutput>, any>({
      path: `/api/pathology/base-pathology-sample-type/get-page`,
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
   * @tags pathology
   * @name GetPageWithoutChildren
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-sample-type/get-page-without-children
   * @secure
   */
  getPageWithoutChildren = (data: GetPageInput<BasePathologySampleTypeQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologySampleTypeListOutput>, any>({
      path: `/api/pathology/base-pathology-sample-type/get-page-without-children`,
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
   * @tags pathology
   * @name Get
   * @summary 查询病理标本
   * @request GET:/api/pathology/base-pathology-sample-type/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologySampleTypeOutput>, any>({
      path: `/api/pathology/base-pathology-sample-type/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name GetAll
   * @summary 查询病理标本所有数据
   * @request GET:/api/pathology/base-pathology-sample-type/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BasePathologySampleTypeOutput>>, any>({
      path: `/api/pathology/base-pathology-sample-type/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Add
   * @summary 新增病理标本
   * @request POST:/api/pathology/base-pathology-sample-type/add
   * @secure
   */
  add = (data: BasePathologySampleTypeAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/base-pathology-sample-type/add`,
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
   * @tags pathology
   * @name Update
   * @summary 修改病理标本
   * @request PUT:/api/pathology/base-pathology-sample-type/update
   * @secure
   */
  update = (data: BasePathologySampleTypeUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-sample-type/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Delete
   * @summary 删除病理标本
   * @request DELETE:/api/pathology/base-pathology-sample-type/delete
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
      path: `/api/pathology/base-pathology-sample-type/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name GetSampleTypeList
   * @summary 获取病理标本类型列表
   * @request POST:/api/pathology/base-pathology-sample-type/get-sample-type-list
   * @secure
   */
  getSampleTypeList = (data: BasePathologySampleTypeQueryListInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-sample-type/get-sample-type-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
