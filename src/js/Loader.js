import { Assets } from 'pixi.js';

import backgroundAsset from '../static/bg.png';
import yellowAsset from '../static/yellow.png';
import redAsset from '../static/red.png';
import blueAsset from '../static/blue.png';
import greenAsset from '../static/green.png';
import purpleAsset from '../static/purple.png';
import yellowMiniAsset from '../static/mini_yellow.png';
import redMiniAsset from '../static/mini_red.png';
import blueMiniAsset from '../static/mini_blue.png';
import greenMiniAsset from '../static/mini_green.png';
import purpleMiniAsset from '../static/mini_purple.png';
import plateAsset from '../static/plate.png';
import progressPurpleAsset from '../static/progress_purple.png';
import progressGreenAsset from '../static/progress_green.png';
import progressBlueAsset from '../static/progress_blue.png';
import progressRedAsset from '../static/progress_red.png';
import progressYellowAsset from '../static/progress_yellow.png';

export default class Loader {
    constructor() {
        this.crystals = null;
        this.progressBars = null;
        this.background = null;
        this.minicrystals = null;
    }

    async loadCrystals() {
        if (this.crystals) return this.crystals;

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

    async loadMiniCrystals() {
        if (this.minicrystals) return this.minicrystals;

        try {
            const minicrystalTextures = await Promise.all([
                Assets.load(yellowMiniAsset),
                Assets.load(redMiniAsset),
                Assets.load(blueMiniAsset),
                Assets.load(greenMiniAsset),
                Assets.load(purpleMiniAsset)
            ]);

            this.minicrystals = {
                yellow: minicrystalTextures[0],
                red: minicrystalTextures[1],
                blue: minicrystalTextures[2],
                green: minicrystalTextures[3],
                purple: minicrystalTextures[4]
            };

            return this.minicrystals;
        } catch (error) {
            console.error('Error loading minicrystal assets:', error);
            throw new Error('Failed to load minicrystal assets');
        }
    }

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

    async loadBackground() {
        if (this.background) return this.background;

        try {
            const backgroundTexture = await Assets.load(backgroundAsset);
            this.background = backgroundTexture;

            return this.background;
        } catch (error) {
            console.error('Error loading background: ', error);
            throw new Error('Failed to load background');
        }
    }
}
