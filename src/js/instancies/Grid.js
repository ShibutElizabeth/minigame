import { Sprite } from 'pixi.js';
import gsap from 'gsap';
import LoaderManager from './managers/LoaderManager';
import DimensionsManager from './managers/DimensionsManager';
import { crystalTypes, SIZES } from "../constants";

export default class Grid {
    constructor(app, game) {
        this.app = app;
        this.game = game;

        this.dimensionsManager = new DimensionsManager(this.app.screen.width);
        this.dimensions = this.dimensionsManager.calculateGridDimensions();

        this.loaderManager = new LoaderManager();
        this.textures = null;
        
        this.crystalsArray = [];
        this.crystalSprites = [];
        this.plateSprites = [];
        this.data = [];
        
        this.restart();
    }

    async loadAssets() {
        if(!this.textures){
            this.textures = await this.loaderManager.loadCrystals();
        }
    }

    generateData() {
        const data = [];

        for (let row = 0; row < SIZES.ROWS; row++) {
            for (let col = 0; col < SIZES.COLUMNS; col++) {
                data.push({
                    x: this.dimensions.margin.left + col * (this.dimensions.size + this.dimensions.padding.left),
                    y: this.dimensions.margin.top + row * (this.dimensions.size + this.dimensions.padding.top),
                    size: this.dimensions.size
                });
            }
        }

        return data;
    }

    generateCrystalsArray() {
        const crystalsArray = crystalTypes.flatMap(type => Array(3).fill(type));

        return this.shuffleArray(crystalsArray);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    createPlateSprite({ x, y, size }, index) {
        const plateSprite = new Sprite(this.textures.plate);
        plateSprite.position.set(x, y);
        plateSprite.width = size;
        plateSprite.height = size;
        plateSprite.interactive = true;
        plateSprite.buttonMode = true;
        plateSprite.alpha = 1.0;
        plateSprite.on('pointerdown', (event) => this.openCrystal(event.global, index));
        
        return plateSprite;
    }

    createCrystalSprite({ x, y, size }, crystalType) {
        const crystalSprite = new Sprite(this.textures[crystalType]);
        crystalSprite.position.set(x, y);
        crystalSprite.width = size;
        crystalSprite.height = size;
        // crystalSprite.visible = false;
        
        return crystalSprite;
    }

    openCrystal(event, index) {
        const crystalType = this.crystalsArray[index];
        const crystalSprite = this.crystalSprites[index];
        const plateSprite = this.plateSprites[index];

        this.animateSprite(plateSprite, crystalSprite)

        const mouse = { x: event.x, y: event.y };
        
        this.game.progress[crystalType]++;
        this.game.checkProgress(mouse);
    }

    animateSprite(plateSprite, crystalSprite){
        gsap.to(plateSprite, {
            duration: 0.5, 
            alpha: 0,
            onComplete: () => {
                plateSprite.visible = false;
                crystalSprite.visible = true;
            }
        });
    }

    place() {
        this.clear();

        this.data.forEach((info, index) => {
            const crystalSprite = this.createCrystalSprite(info, this.crystalsArray[index]);
            const plateSprite = this.createPlateSprite(info, index);

            this.crystalSprites.push(crystalSprite);
            this.plateSprites.push(plateSprite);
            
            this.app.stage.addChild(crystalSprite);
            this.app.stage.addChild(plateSprite); 
        });
    }
    
    spriteResize(sprite, info){
        sprite.position.set(info.x, info.y);
        sprite.width = info.size;
        sprite.height = info.size;
    }

    resize() {
        this.dimensionsManager.updateWidth(this.app.screen.width);
        this.dimensions = this.dimensionsManager.calculateGridDimensions();
        
        this.data = this.generateData();

        for(let i = 0; i < this.plateSprites.length; i++){
            this.spriteResize(this.plateSprites[i], this.data[i])
            this.spriteResize(this.crystalSprites[i], this.data[i])
        }
    }

    restart(){
        this.crystalsArray = this.generateCrystalsArray();
        this.data = this.generateData();
    }

    clear() {
        [...this.plateSprites, ...this.crystalSprites].forEach((sprite) => {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
        });

        this.plateSprites = [];
        this.crystalSprites = [];
    }
}
