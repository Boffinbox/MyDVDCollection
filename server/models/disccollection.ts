import { Schema, model, Types } from "mongoose"

interface IDiscCollectionSchema
{
    title: string;
    discs: Types.ObjectId[]
}

const DiscCollectionSchema = new Schema(
    {
        title: { type: String, required: true },
        discs: [
            {
                type: Types.ObjectId,
                ref: "dvd"
            }
        ]
    }
)

export const DiscCollection = model<IDiscCollectionSchema>("disccollection", DiscCollectionSchema); 