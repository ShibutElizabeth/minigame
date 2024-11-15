import { Text, TextStyle } from 'pixi.js';

import DimensionsManager from './managers/DimensionsManager';
import { crystalTypes, SIZES } from "../constants";

export default class ProgressTexts {
    constructor(app){
        this.app = app;
        
        this.dimensionsManager = new DimensionsManager(this.app.screen.width);
        this.dimensions = this.dimensionsManager.calculateProgressTextDimensions();

        this.data = [];
        this.textsMap = new Map();
        this.textSprites = [];

        this.restart();
    }

    generateData(){
        const data = [];

        for(let col = 0; col < SIZES.COLUMNS; col++){
            data.push({
                x: this.dimensions.margin.left + col * this.dimensions.gap,
                y: this.dimensions.margin.top,
                style: new TextStyle(this.dimensions.style)
            });
        }

        return data;
    }

    place(){
        this.clear();

        const inner = 'Progress\n0/3';
        this.data.forEach((info, index) => {
            const text = new Text({ text: inner.toUpperCase(), style: info.style });
            text.x = info.x;
            text.y = info.y;
            this.textSprites.push(text);
            this.textsMap.set(crystalTypes[index], text);
            
            this.app.stage.addChild(text);
        });
    }

    resize() {
        this.dimensionsManager.updateWidth(this.app.screen.width);
        this.dimensions = this.dimensionsManager.calculateProgressTextDimensions();
        
        this.data = this.generateData();
        
        this.textSprites.forEach((textSprite, index) => {
            const info = this.data[index];
            textSprite.position.set(info.x, info.y);
            textSprite.style.fontSize = info.style.fontSize;
        });
    }

    restart(){
        this.data = this.generateData();
    }

    clear() {
        this.textSprites.forEach((sprite) => {
            this.app.stage.removeChild(child);
            sprite.destroy();
        })

        this.textSprites = [];
        this.textsMap.clear();
    }
}