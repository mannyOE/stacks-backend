import {createConnection, Connection, Model} from 'mongoose'

import conf from '@configs/mongo'

import userFactory, {UserInterface} from './user'
import otpFactory, { OTPInterface } from './otps'
import adminFactory, { AdminInterface } from './administrators'
import providerFactory, {ProviderInterface} from './providers'

/**
 * @param {Connection} conn The mongoose connection instance for mongodb
 * @category Models
 */
export const conn: Connection = createConnection(conf.uri, conf.options)

/**
 * @param {Model<UserInterface>} instance of User model
 * @category Models
 */
export const User: Model<UserInterface> = userFactory(conn)
export const OTP: Model<OTPInterface> = otpFactory(conn)
export const ADMIN: Model<AdminInterface> = adminFactory(conn)
export const Providers: Model<ProviderInterface> = providerFactory(conn)


conn.once('open', (): void => console.log('db connection open'))
