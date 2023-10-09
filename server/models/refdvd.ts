import { Schema, model, Types } from "mongoose"
import { IRefDVDSchema } from "Interfaces"

const RefDVDSchema = new Schema(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

export const RefDVD = model<IRefDVDSchema>("referencedvd", RefDVDSchema);