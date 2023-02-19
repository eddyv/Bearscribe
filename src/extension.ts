// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from 'openai';

// load the .env file
require("dotenv").config({ path: __dirname + "/../.env" });


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_KEY,
	});
	const openai = new OpenAIApi(configuration);

	const disposable = vscode.commands.registerCommand('extension.Bs', () => {
		// get the current text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// get the codeblock within the selection
			let codeblock = document.getText(selection);

			const getOpenAIResponse = async () => {
				const { data } = await openai.createEdit({
					model: "text-davinci-edit-001",
					input: codeblock,
					instruction: 'Add documentation'
				});

				console.log(`data: ${data}`);

				editor.edit(editBuilder => {
					// if the line is negative, it will insert at the start of the document
					editBuilder.replace(selection, `${data.choices[0].text}` || "No response from OpenAI");
				});
			};

			getOpenAIResponse();


		}
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
