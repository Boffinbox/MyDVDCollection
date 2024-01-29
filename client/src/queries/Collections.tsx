import { queryOptions } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/get/GetCollections"
import { Wait } from "../utilities/Wait"

export function CollectionsQueryOptions(token: string | undefined)
{
    return queryOptions({
        queryKey: ["collections"],
        queryFn: () => Wait(2000).then(() => GetCollections(token))
    })
}