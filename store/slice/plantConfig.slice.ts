import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PlantConfigDTO } from '../../interface/PlantConfigDTO.interface'

export const plantConfigSlice = createApi({
  reducerPath: "plant_config",
  tagTypes: ['ConfigPlant'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://plant-pied-nine.vercel.app'
  }),
  endpoints: (build) => ({
    getConfig: build.query<PlantConfigDTO, void>({
      query: () => '/plant/config',
      providesTags: ['ConfigPlant']
    }),
    saveConfig: build.mutation<PlantConfigDTO, PlantConfigDTO>({
      query: (wifis) => ({
        url: '/plant/config/save',
        method: 'POST',
        body: wifis
      }),
      invalidatesTags: ['ConfigPlant']
    }),
  })
})

export const { useGetConfigQuery, useSaveConfigMutation } = plantConfigSlice
