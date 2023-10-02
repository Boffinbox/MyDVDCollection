import { Schema, model } from "mongoose"
import { IDVD } from "../Interfaces"

const DVDSchema = new Schema<IDVD>(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

export const DVD = model<IDVD>("DVD", DVDSchema);