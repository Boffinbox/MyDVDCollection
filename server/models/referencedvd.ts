import { Schema, model, Types } from "mongoose"
import { IReferenceDVDSchema } from "Interfaces"

const ReferenceDVDSChema = new Schema(
    {
        title: { type: String, required: true },
        barcode: { type: String, required: true }
    }
)

export const ReferenceDVD = model<IReferenceDVDSchema>("referencedvd", ReferenceDVDSChema);