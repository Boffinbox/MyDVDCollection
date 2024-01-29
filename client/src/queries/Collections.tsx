import { QueryClient, queryOptions, useMutation } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/get/GetCollections"
import { Wait } from "../utilities/Wait"
import { PostCollection } from "../httpverbs/post/PostCollection"

export function CollectionsQueryOptions(token: string | undefined)
{
    return queryOptions({
        queryKey: ["collections"],
        queryFn: () => GetCollections(token)
    })
}

// export function NewCollectionMutation()
// {
//     return useMutation({
//         mutationFn: ({ token, title }: { token: string | undefined, title: string }) => Wait(2000).then(() => PostCollection(token, title))
//     })
// }