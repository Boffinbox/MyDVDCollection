import { Schema, model, InferSchemaType } from "mongoose"

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

type TDiscCollectionSchema = InferSchemaType<typeof DiscCollectionSchema>

export const DiscCollection = model<TDiscCollectionSchema>("disccollection", DiscCollectionSchema); 