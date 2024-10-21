import { Assets } from 'pixi.js';
import { paths } from '../../constants';

export default class LoaderManager {
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
                Assets.load(paths.yellow),
                Assets.load(paths.red),
                Assets.load(paths.blue),
                Assets.load(paths.green),
                Assets.load(paths.purple),
                Assets.load(paths.plate)
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
                Assets.load(paths.yellowMini),
                Assets.load(paths.redMini),
                Assets.load(paths.blueMini),
                Assets.load(paths.greenMini),
                Assets.load(paths.purpleMini)
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
                Assets.load(paths.progressYellow),
                Assets.load(paths.progressRed),
                Assets.load(paths.progressBlue),
                Assets.load(paths.progressGreen),
                Assets.load(paths.progressPurple)
            ]);

            this.progressBars = {
                yellow: progressBarTextures[0],
                red: progressBarTextures[1],
                blue: progressBarTextures[2],
                green: progressBarTextures[3],
                purple: progressBarTextures[4]
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
            const backgroundTexture = await Assets.load(paths.background);
            this.background = backgroundTexture;

            return this.background;
        } catch (error) {
            console.error('Error loading background: ', error);
            throw new Error('Failed to load background');
        }
    }
}
