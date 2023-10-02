import { Schema, model, InferSchemaType } from "mongoose"

const DVDSchema = new Schema(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

type TDVDSchema = InferSchemaType<typeof DVDSchema>

export const DVD = model<TDVDSchema>("DVD", DVDSchema);