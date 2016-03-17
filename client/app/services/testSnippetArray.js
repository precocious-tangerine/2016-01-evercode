var testSnippets = 	
[ { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: 'snippet1.txt',
    filePath: 'testuser/folder1/snippet1.txt',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: 'snippet2.txt',
    filePath: 'testuser/snippet2.txt',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: 'snippet3.txt',
    filePath: 'testuser/folder2/snippet3.txt',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: 'snippet4.txt',
    filePath: 'testuser/folder1/subfolder1/snippet4.txt',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: 'snippet5.txt',
    filePath: 'testuser/folder1/subfolder2/snippet5.txt',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: '.config',
    filePath: 'testuser/.config',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: '.config',
    filePath: 'testuser/folder1/.config',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: '.config',
    filePath: 'testuser/folder2/.config',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: '.config',
    filePath: 'testuser/folder1/subfolder1/.config',
    labels: 'important',
    sharUrl: 'not supported' },
  { _createdAt: 'today',
    _updatedAt: 'now',
    createdBy: 'testuser',
    name: '.config',
    filePath: 'testuser/folder1/subfolder2/.config',
    labels: 'important',
    sharUrl: 'not supported' } ];

var invalidTestSnippets2 = [{
 __v: 0,
 _createdAt: "2016-03-17T02:05:25.124Z",
 _id: "56ea10eebbd40eaf258988b1",
 _updatedAt: "2016-03-17T02:05:25.124Z",
 createdBy: "test@mail.com",
 data: "..",
 filePath: "test@mail.com",
 name: ".config"
}, {
 __v: 0,
 _createdAt: "2016-03-17T02:05:25.124Z",
 _id: "56ea10fbbbd40eaf258988b3",
 _updatedAt: "2016-03-17T02:05:25.124Z",
 createdBy: "test@mail.com",
 data: "..",
 filePath: "test@mail.com/hello",
 name: ".config"
}];

var testSnippets2 = [{
 __v: 0,
 _createdAt: "2016-03-17T02:05:25.124Z",
 _id: "56ea10eebbd40eaf258988b1",
 _updatedAt: "2016-03-17T02:05:25.124Z",
 createdBy: "test@mail.com",
 data: "..",
 filePath: "test@mail.com/.config",
 name: ".config"
}, {
 __v: 0,
 _createdAt: "2016-03-17T02:05:25.124Z",
 _id: "56ea10fbbbd40eaf258988b3",
 _updatedAt: "2016-03-17T02:05:25.124Z",
 createdBy: "test@mail.com",
 data: "..",
 filePath: "test@mail.com/hello/.config",
 name: ".config"
}];



var objs = {};
testSnippets2.forEach(function(obj) {
    objs[obj.filePath] = obj;
});





module.exports = objs;
    
=======
module.exports.testSnippets = [{
  __v: 0
  _createdAt: "2016-03-17T02:05:25.124Z"
  _id: "56ea10eebbd40eaf258988b1"
  _updatedAt: "2016-03-17T02:05:25.124Z"
  createdBy: "test@mail.com"
  data: ".."
  filePath: "test@mail.com"
  name: ".config"
}, {
  __v: 0
  _createdAt: "2016-03-17T02:05:25.124Z"
  _id: "56ea10fbbbd40eaf258988b3"
  _updatedAt: "2016-03-17T02:05:25.124Z"
  createdBy: "test@mail.com"
  data: ".."
  filePath: "test@mail.com/hello"
  name: ".config"
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: 'snippet3.txt',
  filePath: 'testuser/folder2/snippet3.txt',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: 'snippet4.txt',
  filePath: 'testuser/folder1/subfolder1/snippet4.txt',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: 'snippet5.txt',
  filePath: 'testuser/folder1/subfolder2/snippet5.txt',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: '.config',
  filePath: 'testuser/.config',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: '.config',
  filePath: 'testuser/folder1/.config',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: '.config',
  filePath: 'testuser/folder2/.config',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: '.config',
  filePath: 'testuser/folder1/subfolder1/.config',
  labels: 'important',
  sharUrl: 'not supported'
}, {
  _createdAt: 'today',
  _updatedAt: 'now',
  createdBy: 'testuser',
  name: '.config',
  filePath: 'testuser/folder1/subfolder2/.config',
  labels: 'important',
  sharUrl: 'not supported'
}];