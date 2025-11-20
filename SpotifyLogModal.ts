import { processCurrentlyPlayingResponse } from "api";
import { App, ButtonComponent, Modal, Setting, TextComponent } from "obsidian";

export class SpotifyLogModal extends Modal {
	constructor(
		app: App,
		currentlyPlaying,
		onSubmit: (result: string) => void,
	) {
		super(app);

		const songInfo = processCurrentlyPlayingResponse(currentlyPlaying);

		const title = `${songInfo.artists} - ${songInfo.name}`;
		this.setTitle(title);

		let input = "";

		this.contentEl.addClass("spotify-log-modal-content-container");

		const textComponent = new TextComponent(this.contentEl);

		textComponent.inputEl.addClass("spotify-log-modal-input");
		textComponent.inputEl.addEventListener("keydown", (event) => {
			if (!event.isComposing && event.key === "Enter") {
				event.preventDefault();
				onSubmit(input);
				this.close();
			}
		});
		textComponent.onChange((value) => {
			console.log(input);
			input = value;
		});

		this.contentEl.createEl("div", {
			text: songInfo.progress,
			cls: "spotify-log-modal-progress",
		});

		const buttonContainer = this.contentEl.createDiv(
			"spotify-log-modal-button-container",
		);

		const searchButton = new ButtonComponent(buttonContainer)
			.setButtonText("Search song")
			.onClick(() => {
				console.log("searching");
			});

		const saveButton = new ButtonComponent(buttonContainer)
			.setButtonText("Save")
			.setCta()
			.onClick(() => {
				onSubmit(input);
				this.close();
			});
	}
}
