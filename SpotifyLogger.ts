import { App, normalizePath } from "obsidian";
export const logSong = async (app: App, folderPath: string, song) => {
	const album = song.album.name;
	const albumid = song.album.id;
	const artists = song.artists;
	const id = song.id; // file name
	const name = song.name;

	// check if file exists
	const filePath = normalizePath(folderPath + "/" + id + ".md");

	let file = app.vault.getFileByPath(filePath);

	if (!file) {
		file = await app.vault.create(filePath, "");
		/* edit frontmatter for https://github.com/snezhig/obsidian-front-matter-title
		 * this is to change the file display title, since the title is a unique spotify id
		 */
		app.fileManager.processFrontMatter(file, (frontmatter) => {
			frontmatter["title"] = name; // TODO: let user change which frontmatter should reflect display title?
		});

		// TODO: notify frontmatter that display should update
	}

	await app.workspace.getLeaf().openFile(file);
};
