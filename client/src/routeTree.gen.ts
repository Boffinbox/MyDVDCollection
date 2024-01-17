import { FileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'
import { Route as CollectionsCollectionIdImport } from './routes/collections.$collectionId'

const LoginComponentImport = new FileRoute('/login').createRoute()
const CollectionsComponentImport = new FileRoute('/collections').createRoute()
const IndexComponentImport = new FileRoute('/').createRoute()

const LoginComponentRoute = LoginComponentImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import('./routes/login.component'),
    'component',
  ),
})

const CollectionsComponentRoute = CollectionsComponentImport.update({
  path: '/collections',
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import('./routes/collections.component'),
    'component',
  ),
})

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
    '/collections': {
      preLoaderRoute: typeof CollectionsComponentImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginComponentImport
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
  CollectionsComponentRoute.addChildren([CollectionsCollectionIdRoute]),
  LoginComponentRoute,
])
