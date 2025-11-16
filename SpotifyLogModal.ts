import { getCurrentlyPlayingTrack } from "api";
import { App, Modal, Setting } from "obsidian";
import { logSong } from "SpotifyLogger";

export class SpotifyLogModal extends Modal {
	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.setTitle("Enter thoughts:");
		let input = "";

		// use text or textArea?
		const inputSetting = new Setting(this.contentEl).addText((text) => {
			text.inputEl.addClass("spotifyLogModalInput");
			text.onChange((value) => {
				input = value;
				console.log(name);
			});
		});

		// remove because prevents text area from taking full width
		inputSetting.infoEl.remove();

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("Save")
				.setCta() // "set call to action" (changes button style)
				.onClick(async () => {
					onSubmit(input);
					this.close();
				}),
		);
	}
}
