
//Handling which snippet is currently selected
export const setSelectedSnippet = (snippet) => {
	return {
		type: 'SET_SELECTED_SNIPPET',
		file
	};
};
export const removeSelectedSnippet = () => {
	return {
		type: 'REMOVE_SELECTED_SNIPPET'
	};
};


//Handling which folder is currently selected
export const setSselectedFolder = (folder) => {
	return {
		type: 'SET_SELECTED_FOLDER',
		folder
	};
};
export const removeSelectedFolder = () => {
	return {
		type: 'REMOVE_SELECTED_FOLDER'
	};
};


//Handling adding/removing snippets to main file tree
export const addSnippetToFileTree = (snippet) => {
	return {
		type: 'ADD_NEW_SNIPPET',
		snippet
	};
};
export const removeSnippetFileTree = (snippet) => {
	return {
		type: 'REMOVE_SNIPPET',
		snippet
	};
};

//Handling adding/removing folder to main file tree
export const addFolderToFileTree = (folder) => {
	return {
		type: 'ADD_NEW_FOLDER',
		folder
	};
};
export const removeFolderFileTree = (folder) => {
	return {
		type: 'REMOVE_FOLDER',
		folder
	};
};

//Set file tree snippet
export const setFileTree = (fileTree) => {
	return {
		type: 'SET_FILE_TREE',
		fileTree
	};
};