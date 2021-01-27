import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {SinonStub, stub, spy, SinonSpy} from 'sinon'
import {describe, afterEach, beforeEach, it} from 'mocha'
import {Error as MongooseError, Model} from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as faker from 'faker'
import {range} from 'lodash'

import {
	DatabaseException,
	DuplicateException,
	ResourceNotFoundException
} from '../../../exceptions'
import Module, {NewCompany} from '../../auth/index'
import user, {UserInterface} from '../../../models/user'
import invite, {InviteInterface} from '../../../models/invite'
import member, {MemberInterface} from '../../../models/member'
import {mongooseModel, mongoObjectId} from '../../../__test__/util'
import exp = require('constants')

chai.use(chaiAsPromised)
const {expect} = chai

const userInputFactory = (): NewCompany => {
	return {
		name: faker.name.findName(),
		email: faker.internet.email(),
		phone: faker.phone.phoneNumber(),
		password: faker.internet.password()
	} as any
}

const dbUserFactory = (input?: object): UserInterface => {
	const main = userInputFactory()
	const extra = {
		_id: mongoObjectId(),
		accountType: 'individual',
		disabled: false,
		createdAt: faker.date.recent(),
		updatedAt: faker.date.recent(),
		save: function () {
			return this
		},
		remove: () => {}
	}

	if (typeof input === 'object') {
		return Object.assign({}, input, extra) as any
	}
	return Object.assign({}, main, extra) as any
}

after(() => {
	delete require.cache[require.resolve('../index')]
})

describe('UserModule', () => {
	let model: Model<UserInterface>
	let module: Module
	let invites: Model<InviteInterface>
	let members: Model<MemberInterface>

	beforeEach(() => {
		model = mongooseModel() as any
		module = new Module({model, invite: invites, member: members})
	})

	describe('create()', () => {
		let modelCreate: SinonStub
		let userInput: NewCompany

		beforeEach(() => {
			modelCreate = stub(model, 'create')
			userInput = userInputFactory()
		})

		afterEach(() => {
			modelCreate.restore()
		})

		it('should successfully create a new user', async () => {
			const dbUser = dbUserFactory(userInput)
			modelCreate.returns(user)

			expect(await module.create(userInput)).to.deep.includes(dbUser)
			expect(modelCreate.calledOnce).to.be.true
		})

		it('should hash supplied password and return true when compared with plain password', async () => {
			const dbUser = dbUserFactory(userInput)
			dbUser.password = await bcrypt.hash(userInput.password, 10)
			modelCreate.returns(dbUser)

			const user = await module.create(userInput)
			expect(await bcrypt.compare(userInput.password, user.password)).to.be.true
		})

		it('should throw DuplicateException when user already exist', async () => {
			modelCreate
				.onFirstCall()
				.returns(dbUserFactory(userInput))
				.onSecondCall()
				.throws(new DatabaseException())

			await module.create(userInput) // create user the first time
			await expect(module.create(userInput)).to.be.rejectedWith(
				DuplicateException
			)
		})

		it('should throw MongooseError.ValidationError when an invalid email is supplied @unit', async () => {
			modelCreate.throws(new MongooseError.ValidationError())
			userInput.email = 'wrong_email'
			await expect(module.create(userInput)).to.be.rejectedWith(
				MongooseError.ValidationError
			)
		})
	})

	describe('get()', () => {
		let findModel: SinonStub

		beforeEach(() => {
			findModel = stub(model, 'find')
		})

		it('should return an array of users', async () => {
			const dbUsers = range(0, 5).map((i) => dbUserFactory())
			findModel.returns(dbUsers)

			expect(await module.get({}))
				.to.be.an('array')
				.with.length(dbUsers.length)
				.that.equals(dbUsers)
		})

		it('should return records based on limit specified', async () => {
			const limit = 5
			const dbUsers = range(0, limit).map((i) => dbUserFactory())
			findModel.returns(dbUsers)

			expect(await module.get({limit})).to.have.length(limit)
		})

		it('should return only records where name or email matches searched keyword', async () => {
			const keyword = 'mike'
			const dbUsers = range(0, 10).map((i) => dbUserFactory())

			dbUsers[3].name = keyword
			dbUsers[8].email = `${keyword}@mail.com`
			findModel.returns(dbUsers)

			const result = await module.get({search: keyword})
			const expr = new RegExp(keyword, 'ig')
			expect(result).to.have.length.greaterThan(0)
			expect(result.every((i) => expr.test(i.name) || expr.test(i.email))).to.be
				.true
		})
	})

	describe('getOne()', () => {
		let findOneModel: SinonStub

		beforeEach(() => {
			findOneModel = stub(model, 'findOne')
		})

		afterEach(() => {
			findOneModel.restore()
		})

		it('should return only one user', async () => {
			const dbUser = dbUserFactory()
			findOneModel.returns(dbUser)
			expect(module.getOne(dbUser._id as string)).to.deep.contain(dbUser)
		})

		it('should return null when user not found', async () => {
			findOneModel.returns(null)
			expect(module.getOne(mongoObjectId())).to.be.null
		})
	})

	describe('update()', () => {
		let updateModel: SinonStub
		let findOneModel: SinonStub

		beforeEach(() => {
			updateModel = stub(model, 'update')
			findOneModel = stub(model, 'findOne')
		})

		afterEach(() => {
			updateModel.restore()
			findOneModel.restore()
		})

		it('should return updated data of user', async () => {
			const update = {name: 'valentine'}
			const dbUser = dbUserFactory()
			findOneModel.returns(dbUser)
			updateModel.returns(Object.assign(update, dbUser))

			expect(module.update(update, {_id: dbUser._id})).to.have.property(
				'name',
				update.name
			)
			expect(findOneModel.calledOnce).to.be.true
		})

		it('should throw not ResourceNotFoundException when it tries to update a non existent user', async () => {
			findOneModel.returns(null)

			await expect(
				module.update({name: 'felix'}, {_id: ''})
			).to.be.rejectedWith(ResourceNotFoundException)
			expect(findOneModel.calledOnce).to.be.true
		})
	})

	describe('delete()', () => {
		let removeModel: SinonStub
		let findOneModel: SinonStub

		beforeEach(() => {
			removeModel = stub(model, 'deleteOne')
			findOneModel = stub(model, 'findOne')
		})

		afterEach(() => {
			removeModel.restore()
			findOneModel.restore()
		})

		it('should return true after deleting a user', async () => {
			const dbUser = dbUserFactory()
			findOneModel.returns(dbUser)
			removeModel.returns({n: 1, ok: true})

			expect(await module.delete(dbUser._id as string)).to.be.true
			expect(findOneModel.calledOnce).to.be.true
			expect(removeModel.calledOnce).to.be.true
		})

		it('should throw ResourceNotFoundException when it tries to delete a non existent user', async () => {
			findOneModel.returns(null)
			removeModel.returns({n: 0, ok: false})
			await expect(module.delete(mongoObjectId())).to.be.rejectedWith(
				ResourceNotFoundException
			)
			expect(findOneModel.calledOnce).to.be.true
		})
	})

	describe('enable()', () => {
		let findOneModel: SinonStub

		beforeEach(() => {
			findOneModel = stub(model, 'findOne')
		})

		afterEach(() => {
			findOneModel.restore()
		})

		it('should return true after enabling a user', async () => {
			const dbUser = dbUserFactory()
			const saveSpy: SinonSpy = spy(dbUser, 'save')
			findOneModel.returns(dbUser)

			expect(await module.enable(dbUser._id as string)).to.be.true
			expect(findOneModel.calledOnce).to.be.true
			expect(saveSpy.calledOnce).to.be.true
		})

		it('should return false when it did not find user to enable', async () => {
			findOneModel.returns(null)
			expect(await module.enable(mongoObjectId())).to.be.false
			expect(findOneModel.calledOnce).to.be.true
		})
	})

	describe('disable()', () => {
		let findOneModel: SinonStub

		beforeEach(() => {
			findOneModel = stub(model, 'findOne')
		})

		afterEach(() => {
			findOneModel.restore()
		})

		it('should return true after disabling a user', async () => {
			const dbUser = dbUserFactory()
			const saveSpy: SinonSpy = spy(dbUser, 'save')
			findOneModel.returns(dbUser)

			expect(await module.disable(dbUser._id as string)).to.be.true
			expect(findOneModel.calledOnce).to.be.true
			expect(saveSpy.calledOnce).to.be.true
		})

		it('should return false when it did not find user to disable', async () => {
			findOneModel.returns(null)
			expect(await module.disable(mongoObjectId())).to.be.false
			expect(findOneModel.calledOnce).to.be.true
		})
	})
})
