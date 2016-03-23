
import sublime, sublime_plugin
import sys
import os

dirName = os.path.dirname(__file__)
sys.path.append(os.path.join(dirName, 'requests-2.9.1'))
import requests

class NevercodeCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		snippetHeader = "<snippet>\n<content>\n";
		snippetTab = "\n</content>\n<tabTrigger>NC_";
		snippetFooter = "</tabTrigger>\n</snippet>";

		creds = {'email': 'orlandoc@sas.upenn.edu', 'password': 'password'}
		authResp = requests.post('http://localhost:3000/signin', data = creds) 
		authObj = authResp.json();

		if(authObj['msg'] == 'Unauthorized'):
		    print('Invalid Get request.')
		    quit()

		token = authObj['token']
		headers = {'Allow-Control-Allow-Origin': '*', 'Authorization': token}
		snipResp = requests.get('http://localhost:3000/api/user/snippets', headers=headers)
		jsonDict = snipResp.json()

		for key, value in jsonDict.items():
		    if(value['name'] != '.config'): 
		        snippetContent = value['data']
		        snippetName = value['name']
		        fullSnippetFile = snippetHeader + snippetContent + snippetTab + snippetName + snippetFooter
		        snipRef = open(os.path.join(dirName, 'snippets', snippetName + '.sublime-snippet'), 'w+')
		        snipRef.write(fullSnippetFile)
		        snipRef.close()
		print 'Sync complete'
