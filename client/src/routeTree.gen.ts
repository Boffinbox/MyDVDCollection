import { FileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as MdcIndexImport } from './routes/mdc/index'
import { Route as MdcCollectionsImport } from './routes/mdc/collections'
import { Route as MdcCollectionsCollectionIdImport } from './routes/mdc/collections.$collectionId'

const IndexComponentImport = new FileRoute('/').createRoute()

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const IndexComponentRoute = IndexComponentImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import('./routes/index.component'),
    'component',
  ),
})

const MdcIndexRoute = MdcIndexImport.update({
  path: '/mdc/',
  getParentRoute: () => rootRoute,
} as any)

const MdcCollectionsRoute = MdcCollectionsImport.update({
  path: '/mdc/collections',
  getParentRoute: () => rootRoute,
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
      preLoaderRoute: typeof IndexComponentImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/mdc/collections': {
      preLoaderRoute: typeof MdcCollectionsImport
      parentRoute: typeof rootRoute
    }
    '/mdc/': {
      preLoaderRoute: typeof MdcIndexImport
      parentRoute: typeof rootRoute
    }
    '/mdc/collections/$collectionId': {
      preLoaderRoute: typeof MdcCollectionsCollectionIdImport
      parentRoute: typeof MdcCollectionsImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexComponentRoute,
  LoginRoute,
  MdcCollectionsRoute.addChildren([MdcCollectionsCollectionIdRoute]),
  MdcIndexRoute,
])
