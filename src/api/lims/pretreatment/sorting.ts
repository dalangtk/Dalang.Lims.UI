import { ResultBaseOutput } from '../basedata/datacontract/base'
import { SortingInput, SortingOutput, StartSortingInput } from './datacontract/sorting-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'

export class SortingApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name startSorting
   * @summary 开始分拣
   * @request POST:/api/pretreatment/sorting/start-sorting
   * @secure
   */
  startSorting = (data: StartSortingInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<string>, any>({
      path: `/api/pretreatment/sorting/start-sorting`,
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
   * @tags pretreatment
   * @name sorting
   * @summary 分拣
   * @request POST:/api/pretreatment/sorting/sorting
   * @secure
   */
  sorting = (data: SortingInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<SortingOutput>, any>({
      path: `/api/pretreatment/sorting/sorting`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
