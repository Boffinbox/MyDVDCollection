import { Types } from "mongoose"

export interface IRefDVDSchema
{
    title: string;
    barcode: string;
}

export interface IDVDSchema
{
    ref: Types.ObjectId;
    rating: number;
    watched: boolean;
}

export interface IDiscCollectionSchema
{
    title: string;
    discs: Types.ObjectId[]
}
