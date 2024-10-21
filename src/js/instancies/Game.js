import { Application, Sprite } from 'pixi.js';
import LoaderManager from './managers/LoaderManager';
import ProgressBars from './ProgressBars';
import Grid from './Grid';
import ProgressTextManager from './managers/ProgressTextManager';
import ProgressTexts from './ProgressTexts';
import { crystalTypes } from "../constants";

export default class Game {
    constructor() {
        this.app = new Application();
        this.loaderManager = new LoaderManager();

        this.restartButtons = document.querySelectorAll('.js-restart-button');
        this.popup = document.querySelector('.js-popup');

        this.backgroundTexture = null;
        this.background = null;

        this.progress = {
            yellow: 0,
            red: 0,
            blue: 0,
            green: 0,
            purple: 0,
        };
        
        this.setupRestartButtons();
        this.addCanvas();
    }

    async addCanvas() {
        await this.app.init({ transparent: true, resizeTo: window });
        document.body.appendChild(this.app.canvas);
        this.width = this.app.screen.width;
        this.height = this.app.screen.height;
        await this.placeBackground();
        await this.setup();
    }

    async placeBackground() {
        if (!this.backgroundTexture) {
            this.backgroundTexture = await this.loaderManager.loadBackground();
        }

        this.background = new Sprite(this.backgroundTexture);
        this.background.width = this.width;
        this.background.height = this.height;
        this.background.anchor.set(0.5);
        this.background.position.set(this.width/2, this.height/2);

        this.app.stage.addChildAt(this.background, 0);
    }

    async setup() {
        this.grid = new Grid(this.app, this);
        this.progressBars = new ProgressBars(this.app);
        this.progressTexts = new ProgressTexts(this.app);
        this.progressTextManager = new ProgressTextManager(this.progressTexts.textsMap);
        
        await Promise.all([
            this.grid.loadAssets(),
            this.progressBars.loadAssets()
        ]);
        
        this.grid.place();
        this.progressBars.place();
        this.progressTexts.place();

        const preloader = document.querySelector('.js-preloader');
        preloader.style.display = 'none';
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            
            resizeTimeout = setTimeout(() => {
                this.resize(); 
            }, 50);
        });
    }

    initializeProgress() {
        return crystalTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {});
    }

    checkProgress(mouse) {
        this.progressBars.updateMiniCrystals(this.progress, mouse);
    
        for (const key in this.progress) {
            this.progressTextManager.updateProgress(key, this.progress[key]);
    
            if (this.progress[key] >= 3) {
                console.log(`All ${key} crystalls are open! Restarting...`);
                const winImg = document.querySelector('.js-win-image');
                winImg.style.backgroundImage = `url(../../../${key}.png)`;
                this.popup.style.display = 'flex';
                break;
            }
        }
    }

    setupRestartButtons(){
        this.restartButtons.forEach((button) => {
            button.addEventListener('click', this.restart.bind(this));
        });
    }

    restart(){
        this.popup.style.display = 'none';
        this.progress = this.initializeProgress();
        this.grid.restart();
        this.grid.place();
        this.progressBars.restart(this.progress);
        this.progressTextManager.resetProgress();
    }

    resizeBackground(){
        this.background.width = this.width;
        this.background.height = this.height;
        this.background.anchor.set(0.5);
        this.background.position.set(this.width/2, this.height/2);
    }

    resize() {
        this.width = this.app.screen.width;
        this.height = this.app.screen.height;

        this.resizeBackground();
        this.grid.resize();
        this.progressBars.resize();
        this.progressTexts.resize();
        this.progressBars.updateMiniCrystals(this.progress);
    }
}
