import { Sprite } from 'pixi.js';
import Loader from './Loader';
import DimensionsManager from './DimensionsManager';
import { crystalTypes, SIZES } from "./constants";

export default class Grid {
    constructor(app, game) {
        this.app = app;
        this.game = game;

        this.dimensionsManager = new DimensionsManager(this.app.screen.width);
        this.dimensions = this.dimensionsManager.calculateGridDimensions();

        this.loader = new Loader();
        this.textures = null;
        
        this.crystalsArray = [];
        this.crystalSprites = [];
        this.plateSprites = [];
        this.data = [];
        
        this.restart();
    }

    async loadAssets() {
        if(!this.textures){
            this.textures = await this.loader.loadCrystals();
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
        plateSprite.on('pointerdown', (event) => this.openCrystal(event.global, index));
        
        return plateSprite;
    }

    createCrystalSprite({ x, y, size }, crystalType) {
        const crystalSprite = new Sprite(this.textures[crystalType]);
        crystalSprite.position.set(x, y);
        crystalSprite.width = size;
        crystalSprite.height = size;
        crystalSprite.visible = false;
        
        return crystalSprite;
    }

    openCrystal(event, index) {
        const crystalType = this.crystalsArray[index];
        const crystalSprite = this.crystalSprites[index];
        const plateSprite = this.plateSprites[index];

        crystalSprite.visible = true;
        plateSprite.visible = false;

        const mouse = { x: event.x, y: event.y };
        
        this.game.progress[crystalType]++;
        this.game.checkProgress(mouse);
    }

    place() {
        this.clear();

        this.data.forEach((info, index) => {
            const plateSprite = this.createPlateSprite(info, index);
            const crystalSprite = this.createCrystalSprite(info, this.crystalsArray[index]);

            this.plateSprites.push(plateSprite);
            this.crystalSprites.push(crystalSprite);

            this.app.stage.addChild(plateSprite);
            this.app.stage.addChild(crystalSprite);
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
