import {Connection, Model, Schema, Document} from 'mongoose'
export interface ProviderInterface extends Document {
    phone: string
    address: string
    approved: boolean
    email: string
    name: string
    country: string
    media: string
    content: string[]
}
const ProviderSchema = new Schema(
	{
		email: {
			type: String
        },
        phone: {
			type: String
        },
        address: {
			type: String
        },
        approved: {
            type: Boolean,
            default: false
        },
        name: {
			type: String
        },
        country: {
			type: String
        },
        media: {
			type: String
        },
        content: {
			type: [String]
		},
		
	},
	{
		timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
		versionKey: false,
		collection: 'suppliers'
	}
)

export default function factory(conn: Connection): Model<ProviderInterface> {
	return conn.model<ProviderInterface>('Suppliers', ProviderSchema)
}
