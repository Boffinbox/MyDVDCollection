import { FileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { Route as rootRoute } from './routes/__root'

const AboutComponentImport = new FileRoute('/about').createRoute()
const IndexComponentImport = new FileRoute('/').createRoute()
const AboutPostComponentImport = new FileRoute('/about/post').createRoute()

const AboutComponentRoute = AboutComponentImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import('./routes/about.component'),
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

const AboutPostComponentRoute = AboutPostComponentImport.update({
  path: '/post',
  getParentRoute: () => AboutComponentRoute,
} as any).update({
  component: lazyRouteComponent(
    () => import('./routes/about.post.component'),
    'component',
  ),
})
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexComponentImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutComponentImport
      parentRoute: typeof rootRoute
    }
    '/about/post': {
      preLoaderRoute: typeof AboutPostComponentImport
      parentRoute: typeof AboutComponentImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexComponentRoute,
  AboutComponentRoute.addChildren([AboutPostComponentRoute]),
])
