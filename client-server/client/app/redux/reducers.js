import { combineReducers } from 'redux';
import { insertNode, deleteNode, updateNode } from '../services/fileTree.js';

const modifySelectedSnippet = (state = '', action) => {
  switch (action.type) {
    case 'SET_SELECTED_SNIPPET':
      return action.snippetPath;
    case 'REMOVE_SELECTED_SNIPPET':
      return '';
    default:
      return state;
  }
};

const modifySelectedFolder = (state = '', action) => {
  switch (action.type) {
    case 'SET_SELECTED_FOLDER':
      return action.folderPath;
    case 'REMOVE_SELECTED_FOLDER':
      return '';
    default:
      return state;
  }
};

const modifySnippetMap = (state = {}, action) => {
  switch (action.type) {
    case 'SET_SNIPPET_MAP':
      return action.snippetMap;
    case 'ADD_SNIPPET_MAP':
      return insertNode(state, action.filePath, action.snippetMapNode);
    case 'REMOVE_SNIPPET_MAP':
      return deleteNode(state, action.filePath);
    case 'UPDATE_SNIPPET_MAP':
      let { oldFilePath, updateFilePath, updateNodeValues } = action;
      return updateNode(state, oldFilePath, updateFilePath, updateNodeValues);
    case 'DROP_SNIPPET_MAP':
      return {};
    default:
      return state;
  }
};

const modifyActiveUser = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_USER':
      return action.user;
    case 'REMOVE_ACTIVE_USER':
      return {};
    default:
      return state;
  }
};

const modifySelectedPublicSnippet = (state = '', action) => {
  switch (action.type) {
    case 'SET_SELECTED_PUBLIC_SNIPPET':
      return action.snippetPath;
    case 'REMOVE_SELECTED_PUBLIC_SNIPPET':
      return '';
    default:
      return state;
  }
};

const modifyPublicList = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PUBLIC_LIST':
      return action.publicList;
    default:
      return state;
  }
};

export const finalReducer = combineReducers({
  selectedSnippet: modifySelectedSnippet,
  selectedFolder: modifySelectedFolder,
  snippetMap: modifySnippetMap,
  activeUser: modifyActiveUser,
  publicList: modifyPublicList,
  selectedPublicSnippet: modifySelectedPublicSnippet
});
