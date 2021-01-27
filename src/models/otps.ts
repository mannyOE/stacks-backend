import {Connection, Model, Schema, Document} from 'mongoose'
export interface OTPInterface extends Document {
	phone: string
	code: string
    user: string
    expires: Date
}
const OTPSchema = new Schema(
	{
		email: {
			type: String
		},
		code: {
			type: String
        },
        expires: {
			type: Date
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'Users'
		}
	},
	{
		timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
		versionKey: false,
		collection: 'otps'
	}
)

export default function factory(conn: Connection): Model<OTPInterface> {
	return conn.model<OTPInterface>('OTPs', OTPSchema)
}
