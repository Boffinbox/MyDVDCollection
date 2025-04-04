import { queryOptions } from "@tanstack/react-query"
import { GetCollections } from "../httpverbs/GetCollections"
import { GetCollection } from "../httpverbs/GetCollection"
import { GetAccessToken } from "../httpverbs/GetAccessToken"
import { GetDisc } from "../httpverbs/GetDisc"
import { GetReference } from "../httpverbs/GetReference"
import { GetUnknowns } from "../httpverbs/GetUnknowns"
import { GetBarcodes } from "../httpverbs/GetBarcodes"

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
        enabled: !!token,
        staleTime: Infinity
    })
}

export function CollectionQueryOptions(token: string | undefined, collId: string)
{
    return queryOptions({
        queryKey: ["collection", collId],
        queryFn: () => GetCollection(token, collId),
        enabled: !!token && !!collId,
        staleTime: Infinity
    })
}

export function DiscQueryOptions(token: string | undefined, collId: string, discId: string)
{
    return queryOptions({
        queryKey: ["disc", discId],
        queryFn: () => GetDisc(token, collId, discId),
        enabled: !!token && !!collId && !!discId,
        staleTime: Infinity
    })
}

export function ReferenceQueryOptions(token: string | undefined, refId: string)
{
    return queryOptions({
        queryKey: ["reference", refId],
        queryFn: () => GetReference(token, refId),
        enabled: !!token,
        staleTime: Infinity
    })
}

export function UnknownsQueryOptions(token: string | undefined)
{
    return queryOptions({
        queryKey: ["unknowns"],
        queryFn: () => GetUnknowns(token),
        enabled: !!token,
        staleTime: 1000
    })
}

export function BarcodesQueryOptions(token: string | undefined)
{
    return queryOptions({
        queryKey: ["barcodes"],
        queryFn: () => GetBarcodes(token),
        enabled: !!token,
        staleTime: 1000
    })
}