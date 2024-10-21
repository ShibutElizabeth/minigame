import { Sprite } from 'pixi.js';
import gsap from 'gsap';
import Loader from './Loader';
import { crystalTypes, SIZES } from './constants';
import DimensionsManager from './DimensionsManager';

export default class ProgressBars {
    constructor(app) {
        this.app = app;

        this.dimensionsManager = new DimensionsManager(this.app.screen.width);
        this.barDimensions = this.dimensionsManager.calculateProgressBarsDimensions();
        this.miniDimensions = this.dimensionsManager.calculateMiniCrystalsDimensions();

        this.loader = new Loader();
        this.barTextures = null;
        this.miniTextures = null;

        this.barsData = [];
        this.miniData = []
        this.barSprites = [];
        this.miniSprites = [];
        
        this.animationIndices = new Set();

        this.restart();
    }

    async loadAssets() {
        if (!this.barTextures) {
            this.barTextures = await this.loader.loadProgressBars();
        }
        if (!this.miniTextures) {
            this.miniTextures = await this.loader.loadMiniCrystals();
        }
    }

    generateBarsData(){
        const data = [];

        for (let i = 0; i < SIZES.COLUMNS; i++) {
            data.push({
                x: this.barDimensions.margin.left + i * this.barDimensions.size.width,
                y: this.barDimensions.margin.top,
                width: this.barDimensions.size.width,
                height: this.barDimensions.size.height,
            })
        }

        return data;
    }

    generateMiniData(){
        const data = [];

        for (let i = 0; i < SIZES.COLUMNS; i++) {
            for (let j = 0; j < 3; j++) {
                data.push({
                    x: this.miniDimensions.margin.left + j * (this.miniDimensions.padding.left + this.miniDimensions.size.width) + i * this.miniDimensions.padding.between,
                    y: this.miniDimensions.margin.top,
                    width: this.miniDimensions.size.width,
                    height: this.miniDimensions.size.height,
                    type: i
                });
            }
        }

        return data;
    }

    updateMiniCrystals(progress, mouse = null) {
        this.miniSprites.forEach((mini, index) => {
            if (progress) {
                const crystalType = crystalTypes[Math.floor(index / 3)];
                const crystalProgress = progress[crystalType];

                if (!mini.visible && crystalProgress > (index % 3)) {
                    if (mouse) {
                        const { x: targetX, y: targetY } = this.miniData[index];
                        this.animateMiniCrystal(mouse.x, mouse.y, targetX, targetY, crystalType, index);
                    } else {
                        mini.visible = true;
                    }
                }
            } else {
                mini.visible = false;
            }
        });
    }

    animateMiniCrystal(startX, startY, targetX, targetY, type, index) {
        if (this.animationIndices.has(index)) return;
        
        this.animationIndices.add(index);

        const mini = new Sprite(this.miniTextures[type]);
        mini.x = startX;
        mini.y = startY;
        mini.width = this.miniDimensions.size.width;
        mini.height = this.miniDimensions.size.height;

        this.app.stage.addChild(mini);

        gsap.to(mini, {
            x: targetX,
            y: targetY,
            duration: 0.5,
            ease: 'power1.inOut',
            onComplete: () => {
                this.app.stage.removeChild(mini);
                const targetMini = this.miniSprites.find(m => m.x === targetX && m.y === targetY);
                
                if (targetMini) targetMini.visible = true;
            }
        });
    }

    place() {
        this.clear();

        this.barsData.forEach((info, index) => {
            const bar = new Sprite(this.barTextures[crystalTypes[index]]);
            bar.x = info.x;
            bar.y = info.y;
            bar.width = info.width;
            bar.height = info.height;
            this.barSprites.push(bar);
            this.app.stage.addChild(bar);
        });

        this.placeMiniCrystals();
    }

    placeMiniCrystals() {
        this.miniData.forEach((info) => {
            const mini = new Sprite(this.miniTextures[crystalTypes[info.type]]);
            mini.x = info.x;
            mini.y = info.y;
            mini.width = info.width;
            mini.height = info.height;
            mini.visible = false;

            this.miniSprites.push(mini);
            this.app.stage.addChild(mini);
        });
    }

    spriteResize(sprite, info){
        sprite.position.set(info.x, info.y);
        sprite.width = info.width;
        sprite.height = info.height;
    }

    resize() {
        this.dimensionsManager.updateWidth(this.app.screen.width);
        this.barDimensions = this.dimensionsManager.calculateProgressBarsDimensions();
        this.miniDimensions = this.dimensionsManager.calculateMiniCrystalsDimensions();
        this.barsData = this.generateBarsData();
        this.miniData = this.generateMiniData();

        this.barSprites.forEach((barSprite, index) => {
            this.spriteResize(barSprite, this.barsData[index])
        });

        this.miniSprites.forEach((miniSprite, index) => {
            this.spriteResize(miniSprite, this.miniData[index])
        });
    }

    restart() {
        this.barsData = this.generateBarsData();
        this.miniData = this.generateMiniData();
        this.animationIndices.clear();
        this.updateMiniCrystals();
    }

    clear() {
        [...this.barSprites, ...this.miniSprites].forEach((sprite) => {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
        });
        
        this.barSprites = [];
        this.miniSprites = [];
    }
}
