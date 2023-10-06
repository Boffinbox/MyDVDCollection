import { Schema, model } from "mongoose"

interface IRefDVDSchema
{
    title: string;
    barcode: string;
}

const RefDVDSchema = new Schema(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

export const RefDVD = model<IRefDVDSchema>("refdvd", RefDVDSchema);