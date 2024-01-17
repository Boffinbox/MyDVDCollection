import { FileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'

const LoginComponentImport = new FileRoute('/login').createRoute()
const CollectionsComponentImport = new FileRoute('/collections').createRoute()
const IndexComponentImport = new FileRoute('/').createRoute()
const CollectionsCollectionComponentImport = new FileRoute(
  '/collections/collection',
).createRoute()

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

const CollectionsCollectionComponentRoute =
  CollectionsCollectionComponentImport.update({
    path: '/collection',
    getParentRoute: () => CollectionsComponentRoute,
  } as any).update({
    component: lazyRouteComponent(
      () => import('./routes/collections.collection.component'),
      'component',
    ),
  })
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
    '/collections/collection': {
      preLoaderRoute: typeof CollectionsCollectionComponentImport
      parentRoute: typeof CollectionsComponentImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexComponentRoute,
  CollectionsComponentRoute.addChildren([CollectionsCollectionComponentRoute]),
  LoginComponentRoute,
])
