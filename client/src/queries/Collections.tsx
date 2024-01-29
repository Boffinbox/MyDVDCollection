import { queryOptions } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/get/GetCollections"

export function CollectionsQueryOptions(token: string)
{
    queryOptions({
        queryKey: ["collections"],
        queryFn: () => GetCollections(token)
    })
}