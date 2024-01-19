import { rootRouteWithContext } from '@tanstack/react-router'
import { App } from '../App';
import { IAuth } from '../utilities/Auth';

export const Route = rootRouteWithContext<{ auth: IAuth }>()({
    component: App
})