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

export const updateSnippetMap = (oldFilePath, updateFilePath, updateNode) => {
  return {
    type: 'UPDATE_SNIPPET_MAP',
    oldFilePath,
    updateFilePath,
    updateNode
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
export const setSselectedFolder = (folderPath) => {
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


// //Handling adding/removing snippets to main file tree
// export const addSnippetToFileTree = (snippet) => {
//   return {
//     type: 'ADD_NEW_SNIPPET',
//     snippet
//   };
// };
// export const removeSnippetFileTree = (snippet) => {
//   return {
//     type: 'REMOVE_SNIPPET',
//     snippet
//   };
// };

// export const addFolderToFileTree = (folder) => {
//  return {
//    type: 'ADD_NEW_FOLDER'
//    folder
//  };
// };
// export const removeFolderFileTree = (folder) => {
//  return {
//    type: 'REMOVE_FOLDER';
//    folder
//  };
// };

//Set file tree snippet
// export const setFileTree = (fileTree) => {
//   return {
//     type: 'SET_FILE_TREE',
//     fileTree
//   };
// };
