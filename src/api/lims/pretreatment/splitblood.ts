import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '../basedata/datacontract/base'
import {
  PretreatSortSplitBloodDetailOutput,
  PretreatSortSplitBloodListOutput,
  PretreatSortSplitBloodQueryListInput,
  SplitBloodInput,
  SplitBloodOutput,
} from './datacontract/splitblood-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'

export class SplitBloodApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name split-blood
   * @summary 标本分血
   * @request POST:/api/pretreatment/pretreat-sort-split-blood/split-blood
   * @secure
   */
  splitBlood = (data: SplitBloodInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<SplitBloodOutput>, any>({
      path: `/api/pretreatment/pretreat-sort-split-blood/split-blood`,
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
   * @request POST:/api/pretreatment/pretreat-sort-split-blood/get-page
   * @secure
   */
  getPage = (data: GetPageInput<PretreatSortSplitBloodQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<PretreatSortSplitBloodListOutput>, any>({
      path: `/api/pretreatment/pretreat-sort-split-blood/get-page`,
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
   * @name Get
   * @summary 获取分血明细
   * @request GET:/api/pretreatment/pretreat-sort-split-blood/get-detail
   * @secure
   */
  getDetail = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<PretreatSortSplitBloodDetailOutput[]>, any>({
      path: `/api/pretreatment/pretreat-sort-split-blood/get-detail`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}
