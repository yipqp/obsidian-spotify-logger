import { Plugin } from "obsidian";
import { handleAuth } from "src/api";
import {
	OBSIDIANFM_DEFAULT_SETTINGS,
	obsidianfmDefaultSettings,
} from "./settings";
import { registerCommands } from "./commands";
import { SettingTab } from "./ui/SettingTab";

export default class ObsidianFM extends Plugin {
	settings: obsidianfmDefaultSettings;

	async onload() {
		await this.loadSettings();
		this.registerObsidianProtocolHandler(
			"obsidian-fm-spotify-auth",
			async (e) => {
				handleAuth(e);
			},
		);
		registerCommands(this);
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			OBSIDIANFM_DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
