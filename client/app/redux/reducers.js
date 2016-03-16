import { combineReducers } from 'redux';

const modifySelectedSnippet = (state = '', action) => {
  switch (action.type) {
    case 'SET_SELECTED_SNIPPET':
      return action.snippet;
    case 'REMOVE_SELECTED_SNIPPET':
      return '';
    default:
      return state;
  }
};

const modifySelectedFolder = (state = '', action) => {
  switch (action.type) {
    case 'SET_SELECTED_FOLDER':
    return action.folder;
    case 'REMOVE_SELECTED_FOLDER':
      return '';
    default:
      return state;
  }
}

const modifyFileTree = (state = { snippets: [], folders: [] }, action) => {
  let newSnippets, newFolders, newTree;
  switch (action.type) {
    // case 'ADD_NEW_SNIPPET':
    //   newSnippets = state.snippets.push('snippet1');
    //   return Object.assign({}, state, { snippet: newSnippets });
    // case 'REMOVE_SNIPPET':
    //   newSnippets = state.snippets.pop();
    //   return Object.assign({}, state, { snippets: newSnippets });
    // case 'ADD_NEW_FOLDER':
    //   newFolders = state.folders.push('folder1');
    //   return Object.assign({}, state, { folders: [] });
    // case 'REMOVE_NEW_FOLDER':
    //   newFolders = state.folders.pop();
    //   return Object.assign({}, state, { folders: [] });
    case 'SET_FILE_TREE':
      return action.fileTree;
    default:
      return state;
  }
}

const modifySnippetMap = (state = {}, action) => {
  switch(action.type) {
    case 'SET_SNIPPET_MAP':
      return action.snippetMap;
    default:
      return state;
  }
}

export const finalReducer = combineReducers({
  selectedSnippet: modifySelectedSnippet,
  selectedFolder: modifySelectedFolder,
  fileTree: modifyFileTree,
  snippetMap: modifySnippetMap
});
