import { Schema, model } from "mongoose"

interface IDiscCollectionSchema
{
    title: string;
    discs: [Schema.Types.ObjectId]
}

const DiscCollectionSchema = new Schema(
    {
        title: { type: String, required: true },
        discs: [
            {
                type: Schema.Types.ObjectId,
                ref: "DVD"
            }
        ]
    }
)

export const DiscCollection = model<IDiscCollectionSchema>("disccollection", DiscCollectionSchema); 