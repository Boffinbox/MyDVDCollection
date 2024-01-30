import { queryOptions } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/get/GetCollections"
import { GetCollection } from "../httpverbs/get/GetCollection"


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