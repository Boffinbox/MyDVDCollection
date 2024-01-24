import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as MdcImport } from './routes/_mdc'
import { Route as IndexImport } from './routes/index'
import { Route as MdcCollectionsImport } from './routes/_mdc/collections'
import { Route as MdcCollectionsCollectionIdImport } from './routes/_mdc/collections.$collectionId'

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const MdcRoute = MdcImport.update({
  id: '/_mdc',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const MdcCollectionsRoute = MdcCollectionsImport.update({
  path: '/collections',
  getParentRoute: () => MdcRoute,
} as any)

const MdcCollectionsCollectionIdRoute = MdcCollectionsCollectionIdImport.update(
  {
    path: '/$collectionId',
    getParentRoute: () => MdcCollectionsRoute,
  } as any,
)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_mdc': {
      preLoaderRoute: typeof MdcImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_mdc/collections': {
      preLoaderRoute: typeof MdcCollectionsImport
      parentRoute: typeof MdcImport
    }
    '/_mdc/collections/$collectionId': {
      preLoaderRoute: typeof MdcCollectionsCollectionIdImport
      parentRoute: typeof MdcCollectionsImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  MdcRoute.addChildren([
    MdcCollectionsRoute.addChildren([MdcCollectionsCollectionIdRoute]),
  ]),
  LoginRoute,
])
