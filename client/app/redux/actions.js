export const setSnippetMap = (snippetMap) => {
  return {
    type: 'SET_SNIPPET_MAP',
    snippetMap
  };
}
export const addSnippetMap = (filePath, snippetMapNode) => {
  return {
    type: 'ADD_SNIPPET_MAP',
    snippetMapNode,
    filePath
  };
}
export const removeSnippetMap = (filePath) => {
  return {
    type: 'REMOVE_SNIPPET_MAP',
    filePath
  };
}

export const updateSnippetMap = (oldFilePath, updateFilePath, updateNodeValues) => {
  return {
    type: 'UPDATE_SNIPPET_MAP',
    oldFilePath,
    updateFilePath,
    updateNodeValues
  };
  //Handling which snippet is currently selected
}
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
