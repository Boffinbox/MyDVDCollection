import { Schema, model, Document } from "mongoose"

interface IDiscCollection extends Document
{
    title: string;
    discs: [Schema.Types.ObjectId];
}

const DiscCollectionSchema = new Schema<IDiscCollection>(
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

export const DVD = model<IDiscCollection>("disccollection", DiscCollectionSchema); 