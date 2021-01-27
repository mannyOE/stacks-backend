import {Schema} from 'express-validator'

const QuerySchema: Schema = {
	page: {
		in: ['query'],
		toInt: true,
		isInt: true,
		errorMessage: 'page must be an integer',
		optional: true
	},
	limit: {
		in: ['query'],
		toInt: true,
		isInt: true,
		errorMessage: 'limit must be an integer',
		optional: true
	},
	sort: {
		in: ['query'],
		errorMessage: 'expects sort to be an object',
		optional: true
	},
	search: {
		in: ['query'],
		matches: {options: /[a-zA-Z\d]/},
		isLength: {
			options: {min: 3, max: 100},
			errorMessage: 'Must be between 2 to 100 characters'
		},
		errorMessage: 'filter must be a alpha-numeric',
		optional: true
	},
	range: {
		in: ['query'],
		isArray: true,
		optional: true,
		errorMessage: 'range should be an array'
	}
}

export default QuerySchema
