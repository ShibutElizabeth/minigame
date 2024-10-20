import { Assets } from 'pixi.js';

import backgroundAsset from '../static/bg.png';
import yellowAsset from '../static/yellow.png';
import redAsset from '../static/red.png';
import blueAsset from '../static/blue.png';
import greenAsset from '../static/green.png';
import purpleAsset from '../static/purple.png';
import plateAsset from '../static/plate.png';
import progressPurpleAsset from '../static/progress_purple.png';
import progressGreenAsset from '../static/progress_green.png';
import progressBlueAsset from '../static/progress_blue.png';
import progressRedAsset from '../static/progress_red.png';
import progressYellowAsset from '../static/progress_yellow.png';
import restartButtonAsset from '../static/button_restart.png';

export default class Loader {
    constructor() {
        this.crystals = null; // Кэшируем текстуры, чтобы загружать их один раз
        this.progressBars = null;
        this.restartButton = null;
        this.background = null;
    }

    /**
     * Load crystal textures for the game grid.
     * @returns {Promise<Object>} A promise resolving to the crystal textures object.
     */
    async loadCrystals() {
        if (this.crystals) return this.crystals; // Если уже загружены

        try {
            const crystalTextures = await Promise.all([
                Assets.load(yellowAsset),
                Assets.load(redAsset),
                Assets.load(blueAsset),
                Assets.load(greenAsset),
                Assets.load(purpleAsset),
                Assets.load(plateAsset)
            ]);

            this.crystals = {
                yellow: crystalTextures[0],
                red: crystalTextures[1],
                blue: crystalTextures[2],
                green: crystalTextures[3],
                purple: crystalTextures[4],
                plate: crystalTextures[5]
            };

            return this.crystals;
        } catch (error) {
            console.error('Error loading crystal assets:', error);
            throw new Error('Failed to load crystal assets');
        }
    }

    /**
     * Load progress bars textures.
     * @returns {Promise<Object>} A promise resolving to progress bars textures.
     */
    async loadProgressBars() {
        if (this.progressBars) return this.progressBars;

        try {
            const progressBarTextures = await Promise.all([
                Assets.load(progressPurpleAsset),
                Assets.load(progressGreenAsset),
                Assets.load(progressBlueAsset),
                Assets.load(progressRedAsset),
                Assets.load(progressYellowAsset)
            ]);

            this.progressBars = {
                purple: progressBarTextures[0],
                green: progressBarTextures[1],
                blue: progressBarTextures[2],
                red: progressBarTextures[3],
                yellow: progressBarTextures[4]
            };

            return this.progressBars;
        } catch (error) {
            console.error('Error loading progress bars: ', error);
            throw new Error('Failed to load progress bars');
        }
    }

    /**
     * Load background texture.
     * @returns {Promise<Object>} A promise resolving to background texture.
     */
    async loadBackground() {
        if (this.background) return this.background;

        try {
            const backgroundTexture = await Assets.load(backgroundAsset);
            this.background = backgroundTexture;

            return this.background;
        } catch (error) {
            console.error('Error loading restart button: ', error);
            throw new Error('Failed to load a restart button');
        }
    }

    /**
     * Load a restart button texture.
     * @returns {Promise<Object>} A promise resolving to restart button texture.
     */
    async loadRestartButton() {
        if (this.restartButton) return this.restartButton;

        try {
            const restartButtonTexture = await Assets.load(restartButtonAsset);
            this.restartButton = restartButtonTexture;

            return this.restartButton;
        } catch (error) {
            console.error('Error loading restart button: ', error);
            throw new Error('Failed to load a restart button');
        }
    }
}
