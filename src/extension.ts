// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from 'openai';
import { CommentConfigHandler } from './comment-config';

// load the .env file
require("dotenv").config({path: __dirname + "/../.env"});


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

		const commentConfigHandler = new CommentConfigHandler();

		const commentCfg = commentConfigHandler.getCommentConfig(editor?.document?.languageId || "js");

		const commentLineDelimiter = commentCfg?.lineComment;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;
			
			// get the codeblock within the selection
			let codeblock = document.getText(selection);

			const getOpenAIResponse = async () => {
				const { data } = await openai.createCompletion({
					model: "text-davinci-003",
					prompt: `Explain to me what this function does line by line:
					
					${codeblock}`,
					temperature: 0,
					max_tokens: 1000,
				  });

				CommentConfigHandler

				editor.edit(editBuilder => {
					
					const position = new vscode.Position(selection.start.line, 0);
					// if the line is negative, it will insert at the start of the document
					editBuilder.replace(position, `${commentLineDelimiter}${data.choices[0].text?.trimStart().replaceAll("\n", `\n${commentLineDelimiter}`)}\n`  || "");					
				});
			};

			getOpenAIResponse();
			

		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
