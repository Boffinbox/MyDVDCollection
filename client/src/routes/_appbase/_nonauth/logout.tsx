import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PostLogout } from '../../../httpverbs/PostLogout'
import { Wait } from '../../../utilities/Wait'
import { GetAccessToken } from '../../../httpverbs/GetAccessToken'
import DevLog from '../../../utilities/DevLog'

export const Route = createFileRoute('/_appbase/_nonauth/logout')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        let token: string | undefined = await queryClient.getQueryData([
            'accesstoken',
        ])
        DevLog('in preloader: ', token)
        if (token == undefined)
        {
            token = await GetAccessToken()
        }
        if (token == undefined)
        {
            // if it's *still* undefined
            // todo - something went wrong
            return
        }
        try
        {
            await PostLogout(token)
            queryClient.removeQueries({ queryKey: ['accesstoken'], exact: true })
        } catch
        {
            DevLog('oh no!')
        }
    },
    component: Logout,
})

function Logout()
{
    const navigate = useNavigate()

    // this is just a fake delay to make the user feel good
    Wait(1000).then(() => navigate({ to: '/home' }))

    return (
        <>
            <div>Logging out...</div>
        </>
    )
}
