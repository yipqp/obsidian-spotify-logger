import { App, debounce, Debouncer, Notice, SuggestModal } from "obsidian";
import { searchTrack } from "api";

//TODO: move types to new file
interface Song {
	name: string;
	artists: string[];
	id: string;
	image: Image;
}

export interface Image {
	url: string;
	height: number;
	width: number;
}

const img: Image = {
	url: "https://i.scdn.co/image/ab67616d000048510dea455846b0633093676c60",
	height: 50,
	width: 50,
};

const CONST_SONGS: Song[] = [
	{ name: "Stereo Boy", artists: ["FKA twigs"], id: "temp", image: img },
	{ name: "Video", artists: ["Jane Remover"], id: "temp", image: img },
	{ name: "Jaded", artists: ["Malibu"], id: "temp", image: img },
	{ name: "Another High", artists: ["Malibu"], id: "temp", image: img },
	{ name: "Amnesia", artists: ["fakemink"], id: "temp", image: img },
	{ name: "Hoover", artists: ["Yung Lean"], id: "temp", image: img },
	{ name: "Gnaw", artists: ["Alex G"], id: "temp", image: img },
	{ name: "choke enough", artists: ["Oklou"], id: "temp", image: img },
	{ name: "x w x", artists: ["yeule"], id: "temp", image: img },
];

export class SpotifySearchModal extends SuggestModal<Song> {
	// songs: Song[];
	isLoading: boolean;
	lastQuery: string;
	searchDebouncer: Debouncer<
		[query: string, cb: (songs: Song[]) => void],
		Promise<Song[]>
	>;

	constructor(app: App) {
		super(app);
		this.searchDebouncer = debounce(
			async (
				query: string,
				cb: (songs: Song[]) => void,
			): Promise<Song[]> => {
				if (query === "") {
					console.log("query is empty");
					return Promise.resolve([]);
				}
				if (query === this.lastQuery) {
					console.log("query is the same as last");
					return Promise.resolve([]);
				}
				this.lastQuery = query;

				console.log("starting search");
				const data = await searchTrack(query);
				console.log("finished search");

				if (!data) {
					console.log("no data");
					return Promise.resolve([]);
				}

				const items = data.tracks.items;
				const songs: Song[] = items.map((item) => {
					const images = item.album.images;
					const smallest = images[images.length - 1];
					return {
						name: item.name,
						artists: item.artists.map((artist) => artist.name),
						id: item.id,
						image: smallest,
					};
				});

				console.log("search complete");
				console.log(JSON.stringify(songs, null, 2));
				cb(songs);
				return songs;
			},
			300,
			true,
		);
	}

	// Returns all available suggestions.
	// is fired when input is changed
	// reference: https://forum.obsidian.md/t/avoid-frequent-getsuggestions-call-in-suggestmodal/84674
	async getSuggestions(query: string): Promise<Song[]> {
		this.isLoading = true;
		console.log("starting getSuggetsions..");
		return new Promise((resolve) => {
			this.searchDebouncer(query, (query) => {
				resolve(query);
			});
		});
	}

	// const temp = this.debouncedSearch(query);

	// this.resultContainerEl.empty();
	// const r = await this.debouncedSearch(query).run();
	// this.isLoading = false;
	// console.log(r);
	// 	if (!r) return [];
	// 	return r;

	// Renders each suggestion item.
	renderSuggestion(song: Song, el: HTMLElement) {
		el.addClass("song-container");
		const imageEl = el.createEl("img", { cls: "song-img" });
		imageEl.src = song.image.url;
		imageEl.width = song.image.width;
		imageEl.height = song.image.height;
		const songTextContainer = el.createDiv("song-text-container");
		songTextContainer.createEl("div", {
			text: song.name,
			cls: "song-title",
		});
		songTextContainer.createEl("small", { text: song.artists.toString() });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(song: Song, evt: MouseEvent | KeyboardEvent) {
		new Notice(`Selected ${song.name}`);
	}
}
