import { FileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as CollectionsImport } from './routes/collections'
import { Route as CollectionsCollectionIdImport } from './routes/collections.$collectionId'

const IndexComponentImport = new FileRoute('/').createRoute()

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const CollectionsRoute = CollectionsImport.update({
  path: '/collections',
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

const CollectionsCollectionIdRoute = CollectionsCollectionIdImport.update({
  path: '/$collectionId',
  getParentRoute: () => CollectionsRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexComponentImport
      parentRoute: typeof rootRoute
    }
    '/collections': {
      preLoaderRoute: typeof CollectionsImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/collections/$collectionId': {
      preLoaderRoute: typeof CollectionsCollectionIdImport
      parentRoute: typeof CollectionsImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexComponentRoute,
  CollectionsRoute.addChildren([CollectionsCollectionIdRoute]),
  LoginRoute,
])
