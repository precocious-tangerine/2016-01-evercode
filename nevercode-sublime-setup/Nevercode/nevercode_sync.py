import sublime, sublime_plugin
import sys
import os

dirName = os.path.dirname(__file__)
sys.path.append(os.path.join(dirName, 'requests-2.9.1'))
import requests

class NevercodeCommand(sublime_plugin.TextCommand, sublime_plugin.WindowCommand):
	def run(self, edit):
		totalChars = 0
		newView = self.view.window().new_file()
		totalChars += newView.insert(edit, totalChars, 'Initializing...\n')
		snippetHeader = "<snippet>\n<content>\n";
		snippetTab = "\n</content>\n<tabTrigger>NC_";
		snippetFooter = "</tabTrigger>\n</snippet>";
		tokenFile = open(os.path.join(dirName,'client_token.txt'), 'r')
		token = str(tokenFile.read()).strip('\n')
		tokenFile.close()

		totalChars += newView.insert(edit, totalChars, 'Requesting Nevercode Server...\n')
		headers = {'Allow-Control-Allow-Origin': '*', 'Authorization': token}
		snipResp = requests.get('http://localhost:3000/api/user/snippets', headers=headers)
		jsonDict = snipResp.json()

		totalChars += newView.insert(edit, totalChars, 'Response received from Nevercode server.\n')
		totalChars += newView.insert(edit, totalChars, 'User snippets received. Constructing snippets now\n')
		for key, value in jsonDict.items():
		    if(value['name'] != '.config'):
		    		totalChars += newView.insert(edit, totalChars, 'Constructing snippet ' + value['name'] + ' with trigger ' + value['name'] + '\n')
		    		snippetContent = value['data']
		    		snippetName = value['name']
		    		fullSnippetFile = snippetHeader + snippetContent + snippetTab + snippetName + snippetFooter
		    		snipRef = open(os.path.join(dirName, 'snippets', snippetName + '.sublime-snippet'), 'w+')
		    		snipRef.write(fullSnippetFile)
		    		snipRef.close()

		totalChars += newView.insert(edit, totalChars, '\n\nSnippet Consturction Complete. The following files are now available\n')
		for key, value in jsonDict.items():
			if(value['name'] != '.config'):
				totalChars = newView.insert(edit, totalChars, 'Snippet "' + value['name'] + '"  -> Triggered by keyword "' + value['name'] + '"\n')
