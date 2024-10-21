import { Text, TextStyle } from 'pixi.js';
import { crystalTypes } from "./constants";

export default class ProgressTexts {
    constructor(app){
        this.app = app;
        this.width = this.app.screen.width;
        this.columns = 5;

        this.positions = [];
        this.texts = new Map();

        

        window.addEventListener('resize', this.onResize.bind(this));
    }

    calculateSizes(width){
        this.style = new TextStyle({
            margin: 0,
            fontSize: 0.014 * width,
            fill: '#fef9a9',
            letterSpacing: 0.6,
            stroke: '#000000',
            // strokeThickness: 1,
            align: 'center',
            fontWeight: 500
        });

        this.margin = {
            left: 0.1756 * width,
            top: 0.035 * width
        };

        this.gap = 0.0745 * width;
    }

    generatePositions(){
        this.positions = [];
        for(let col = 0; col < this.columns; col++){
            this.positions.push({
                x: this.margin.left + col * (this.gap + 0.079 * this.width),
                y: this.margin.top
            });
        }
    }

    place(){
        const inner = 'Progress\n0/3';
        this.positions.forEach((pos, i) => {
            const text = new Text({ text: inner.toUpperCase(), style: this.style });
            text.x = pos.x;
            text.y = pos.y;
            console.log(text)
            this.texts.set(crystalTypes[i], text);
            this.app.stage.addChild(text);
        })
    }

    clear() {
        // Удаляем старые спрайты прогресс-баров и миникристаллов
        this.texts.forEach((child) => this.app.stage.removeChild(child))
        this.positions = [];
        this.texts.clear();
    }

    // Пересчитываем позиции и размеры на изменение окна
    onResize() {
        this.clear();
        this.width = this.app.screen.width;
        this.calculateSizes(this.width); // Пересчитываем размеры
        this.generatePositions();
        // Перерасполагаем прогресс-бары после ресайза
        this.place();
    }

    restart(){
        this.calculateSizes(this.width);
        this.generatePositions();
    }
}