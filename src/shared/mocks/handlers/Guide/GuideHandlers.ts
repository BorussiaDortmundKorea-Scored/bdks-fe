import { HttpResponse, http } from 'msw'

import GuideDummy from './GuideDummy.json'

export const GuideHandlers = [
  http.get('*/guide', () => {
    return HttpResponse.json(GuideDummy)
  }),
]
