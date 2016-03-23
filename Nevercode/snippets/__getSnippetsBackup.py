import json
import requests

snippetHeader = "<snippet>\n<content>\n";
snippetTab = "\n</content>\n<tabTrigger>";
snippetFooter = "</tabTrigger>NC_\n</snippet>";


#loginAttempts = 0;
#authObj = {'msg': 'Unauthorized'}
#while (loginAttempts < 3 and authObj['msg'] == 'Unauthorized'):
#    if (loginAttempts > 0):
#        print("Invalid credentials, please try again")
#    email = input("Please enter your email: ")
#    password = input("Please enter your password: ")
#    creds = {'email': email, 'password': password}
#    authResp = requests.post('http://localhost:3000/signin', data = creds) 
#    authObj = authResp.json();
#    loginAttempts = loginAttempts + 1

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
        print(value); 
        snippetContent = value['data']
        snippetName = value['name']
        fullSnippetFile = snippetHeader +  snippetTab + snippetName + snippetFooter

        snipRef = open(snippetName, 'w')
        snipRef.write(fullSnippetFile)
