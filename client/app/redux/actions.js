export const setSnippetMap = (snippetMap) => {
  return {
    type: 'SET_SNIPPET_MAP',
    snippetMap
  };
};
export const addSnippetMap = (filePath, snippetMapNode) => {
  return {
    type: 'ADD_SNIPPET_MAP',
    snippetMapNode,
    filePath
  };
};
export const removeSnippetMap = (filePath) => {
  return {
    type: 'REMOVE_SNIPPET_MAP',
    filePath
  };
};
export const updateSnippetMap = (oldFilePath, updateFilePath, updateNodeValues) => {
  return {
    type: 'UPDATE_SNIPPET_MAP',
    oldFilePath,
    updateFilePath,
    updateNodeValues
  };
};
export const clearSnippetMap = () => {
  return {
    type: 'DROP_SNIPPET_MAP'
  };
};

//Handling which snippet is currently selected
export const setSelectedSnippet = (snippetPath) => {
  return {
    type: 'SET_SELECTED_SNIPPET',
    snippetPath
  };
};
export const removeSelectedSnippet = () => {
  return {
    type: 'REMOVE_SELECTED_SNIPPET'
  };
};

//Handling which folder is currently selected
export const setSelectedFolder = (folderPath) => {
  return {
    type: 'SET_SELECTED_FOLDER',
    folderPath
  };
};
export const removeSelectedFolder = () => {
  return {
    type: 'REMOVE_SELECTED_FOLDER'
  };
};

//Handling public snippets
export const setPublicList = (publicList) => {
  return {
    type: 'SET_PUBLIC_LIST',
    publicList
  };
};
export const setSelectedPublicSnippet = (snippetPath) => {
  return {
    type: 'SET_SELECTED_PUBLIC_SNIPPET',
    snippetPath
  };
};
export const removeSelectedPublicSnippet = () => {
  return {
    type: 'REMOVE_SELECTED_PUBLIC_SNIPPET'
  };
};

export const setActiveUser = (user) => {
  return {
    type: 'SET_ACTIVE_USER',
    user
  };
};
export const removeActiveUser = () => {
  return {
    type: 'REMOVE_ACTIVE_USER'
  };
};
