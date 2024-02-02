import { queryOptions } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/GetCollections"
import { GetCollection } from "../httpverbs/GetCollection"
import { GetAccessToken } from "../httpverbs/GetAccessToken"

export function AccessTokenQueryOptions()
{
    return queryOptions({
        queryKey: ["accesstoken"],
        queryFn: () => GetAccessToken()
    })
}


export function CollectionsQueryOptions(token: string | undefined)
{
    return queryOptions({
        queryKey: ["collections"],
        queryFn: () => GetCollections(token)
    })
}

export function CollectionQueryOptions(token: string | undefined, id: string)
{
    return queryOptions({
        queryKey: ["collection", id],
        queryFn: () => GetCollection(token, id)
    })
}