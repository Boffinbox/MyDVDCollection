import { queryOptions } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/GetCollections"
import { GetCollection } from "../httpverbs/GetCollection"
import { GetAccessToken } from "../httpverbs/GetAccessToken"
import { GetDisc } from "../httpverbs/GetDisc"

export function AccessTokenQueryOptions()
{
    return queryOptions({
        queryKey: ["accesstoken"],
        queryFn: () => GetAccessToken(),
        staleTime: 600000
    })
}


export function CollectionsQueryOptions(token: string | undefined)
{
    return queryOptions({
        queryKey: ["collections"],
        queryFn: () => GetCollections(token),
        enabled: !!token
    })
}

export function CollectionQueryOptions(token: string | undefined, collId: string)
{
    return queryOptions({
        queryKey: ["collection", collId],
        queryFn: () => GetCollection(token, collId),
        enabled: !!token && !!collId
    })
}

export function DiscQueryOptions(token: string | undefined, collId: string, discId: string)
{
    return queryOptions({
        queryKey: ["disc", discId],
        queryFn: () => GetDisc(token, collId, discId),
        enabled: !!token && !!collId && !!discId
    })
}