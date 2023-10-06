import { Schema, model, Types } from "mongoose"
import { IDVDSchema } from "Interfaces"

const DVDSchema = new Schema(
    {
        referenceDVD: {
            type: Types.ObjectId,
            ref: "referencedvd"
        },
        rating: { type: Number, required: false },
        watched: { type: Boolean, required: false }
    }
)

export const DVD = model<IDVDSchema>("dvd", DVDSchema);