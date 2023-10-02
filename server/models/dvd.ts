import { Schema, model } from "mongoose"

interface IDVDSchema
{
    title: string;
    barcode: string;
}

const DVDSchema = new Schema(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

export const DVD = model<IDVDSchema>("DVD", DVDSchema);