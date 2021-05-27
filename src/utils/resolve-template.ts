import {join} from 'path'
import {existsSync, readFileSync} from 'fs'
export async function getTemplate(
	template: string,
	data: any
): Promise<string> {
	let path = join(__dirname, 'templates/' + template + '.hbs')
	let fileExists = existsSync(path)
	let content = ''
	if (fileExists) {
		let contents = readFileSync(path, 'utf-8')
		for (var i in data) {
			var x = '{{' + i + '}}'
			while (contents.indexOf(x) > -1) {
				// @ts-ignore
				contents = contents.replace(x, data[i])
			}
		}
		content = contents
	}
	return content
}
