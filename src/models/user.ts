import {Connection, Model, Schema, Document} from 'mongoose'
import {genSaltSync, hash, compare} from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate')
const salt = genSaltSync(10)


/**
 * Attributes of a user
 * @interface
 * @category Models
 */
export interface UserInterface extends Document {
	/**
	 * @param {Function} comparePWD mongoose method to compare password
	 */
	comparePWD: Function
	/**
	 * @param {string} _id unique id of user
	 */
	_id: Schema.Types.ObjectId | string
	/**
	 * @param {boolean} confirmed shoows whether account has been confirmed
	 */
	verified?: boolean
	full_name: string
	fcm_token?: string
	/**
	 * @param {string} email The email of user
	 */
	email: string

	/**
	 * @param {string} mobile number of user
	 */
    mobile: string
    provider: string
	/**
	 * hashed password of user
	 * @param {string} password
	 */
	password: string

	/**
	 * @param {string} avatar filename of user's avatar
	 */
	avatar?: string

	/**
	 * @param {Date} createdAt
	 */
	createdAt?: Date

	/**
	 * @param {Date} updatedAt
	 */
	updatedAt?: Date
}

/**
 * Mongoose schema of a user
 * @category Models
 */
export const UserSchema = new Schema(
	{
		full_name: {
			type: Schema.Types.String,
			required: true
		},
		fcm_token: {
			type: String
		},
		email: {
			type: Schema.Types.String,
			unique: true,
			required: true
		},

		mobile: {
			type: Schema.Types.String,
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: "Providers"
		},
		avatar: {
			type: Schema.Types.String
		},

		password: {
			type: Schema.Types.String,
			required: true
		},

		blocked: {
			type: Schema.Types.Boolean,
			default: false
		},
		verified: {
			type: Schema.Types.Boolean,
			default: false
		},
	},
	{
		collection: 'users',
		timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
	}
)

UserSchema.methods.comparePWD = async function (
	value: string
): Promise<boolean> {
	// Todo: implement password comparison
	let isCorrect = await compare(value, this.password)
	return Promise.resolve(isCorrect)
}

UserSchema.pre<UserInterface>('save', async function (next): Promise<void> {
	// Todo: convert plain password to hashed password
	if (this.isModified('password')) {
		this.password = await hash(this.password, salt)
	}
	next()
})

UserSchema.pre<UserInterface>('update', async function (next): Promise<void> {
	// Todo: convert plain password to hashed password if password is part of update
	if (this.isModified('password')) {
		this.password = await hash(this.password, salt)
	}
	next()
})

UserSchema.plugin(mongoosePaginate)

/**
 * Factory to generate User Model
 * @param {Connection} conn
 * @return {Model<UserInterface>}
 * @category Models
 */
export default function userFactory(conn: Connection): Model<UserInterface> {
	return conn.model<UserInterface>('Users', UserSchema)
}
