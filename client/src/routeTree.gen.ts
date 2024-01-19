import { FileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as CollectionsCollectionIdImport } from './routes/collections.$collectionId'

const CollectionsComponentImport = new FileRoute('/collections').createRoute()
const IndexComponentImport = new FileRoute('/').createRoute()

const CollectionsComponentRoute = CollectionsComponentImport.update({
  path: '/collections',
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import('./routes/collections.component'),
    'component',
  ),
})

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

const CollectionsCollectionIdRoute = CollectionsCollectionIdImport.update({
  path: '/$collectionId',
  getParentRoute: () => CollectionsComponentRoute,
} as any)
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
    '/collections': {
      preLoaderRoute: typeof CollectionsComponentImport
      parentRoute: typeof rootRoute
    }
    '/collections/$collectionId': {
      preLoaderRoute: typeof CollectionsCollectionIdImport
      parentRoute: typeof CollectionsComponentImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexComponentRoute,
  LoginRoute,
  CollectionsComponentRoute.addChildren([CollectionsCollectionIdRoute]),
])
