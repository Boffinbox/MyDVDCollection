import { Schema, model, Document } from "mongoose"

interface IDVD extends Document
{
    title: string;
    barcode: string;
}

const DVDSchema = new Schema<IDVD>(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

export const DVD = model<IDVD>("DVD", DVDSchema);