import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseSorterShelfOutput,
  BaseSorterShelfListOutput,
  BaseSorterShelfAddInput,
  BaseSorterShelfUpdateInput,
  BaseSorterShelfQueryListInput,
} from './datacontract/basesortershelf-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseSorterShelfApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pretreatment/base-sorter-shelf/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseSorterShelfQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseSorterShelfListOutput>, any>({
      path: `/api/pretreatment/base-sorter-shelf/get-page`,
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
   * @summary 查询分拣架
   * @request GET:/api/pretreatment/base-sorter-shelf/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseSorterShelfOutput>, any>({
      path: `/api/pretreatment/base-sorter-shelf/get`,
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
   * @summary 查询分拣架所有数据
   * @request GET:/api/pretreatment/base-sorter-shelf/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseSorterShelfOutput>>, any>({
      path: `/api/pretreatment/base-sorter-shelf/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增分拣架
   * @request POST:/api/pretreatment/base-sorter-shelf/add
   * @secure
   */
  add = (data: BaseSorterShelfAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pretreatment/base-sorter-shelf/add`,
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
   * @summary 修改分拣架
   * @request PUT:/api/pretreatment/base-sorter-shelf/update
   * @secure
   */
  update = (data: BaseSorterShelfUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pretreatment/base-sorter-shelf/update`,
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
   * @summary 删除分拣架
   * @request DELETE:/api/pretreatment/base-sorter-shelf/delete
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
      path: `/api/pretreatment/base-sorter-shelf/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })

  /**
   * No description
   *
   * @tags lims
   * @name Get
   * @summary 查询分拣仪架子
   * @request DELETE:/api/pretreatment/base-sorter-shelf/get-sorter-detail
   * @secure
   */
  getSorterShelf = (data: BaseSorterShelfQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseSorterShelfOutput[]>, any>({
      path: `/api/pretreatment/base-sorter-shelf/get-sorter-detail`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
