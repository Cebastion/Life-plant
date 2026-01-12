import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IListWiFiGet } from '../../interface/listwifi.interface'

export const ListWiFiSlice = createApi({
  reducerPath: "list_wifi",
  tagTypes: ['ListWiFi'],
  baseQuery: fetchBaseQuery({
    baseUrl: '<URL>'
  }),
  endpoints: (build) => ({
    getListWiFi: build.query<Pick<IListWiFiGet, "WiFis">, void>({
      query: () => '/setting',
      providesTags: ['ListWiFi']
    }),
    addWiFi: build.mutation<Pick<IListWiFiGet, "WiFis">, Pick<IListWiFiGet, "WiFis">>({
      query: (wifis) => ({
        url: '/setting',
        method: 'POST',
        body: wifis
      }),
      invalidatesTags: ['ListWiFi']
    }),
    DeleteWiFi: build.mutation<Pick<IListWiFiGet, "WiFis">, Pick<IListWiFiGet, "WiFis">>({
      query: (wifis) => ({
        url: '/setting',
        method: 'POST',
        body: wifis
      }),
      invalidatesTags: ['ListWiFi']
    })
  })
})

export const { useGetListWiFiQuery, useAddWiFiMutation, useDeleteWiFiMutation } = ListWiFiSlice
