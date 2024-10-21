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

    // Генерация позиций для сетки 5x3 на основе отступов и промежутков
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

    // Создание и перемешивание массива кристаллов (по 3 кристалла каждого типа)
    generateCrystalsArray() {
        const crystalsArray = crystalTypes.flatMap(type => Array(3).fill(type));

        return this.shuffleArray(crystalsArray);
    }

    // Перемешивание массива по алгоритму Фишера-Йетса
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    // Создание спрайта плитки с обработчиком клика
    createPlateSprite({ x, y, size }, index) {
        const plateSprite = new Sprite(this.textures.plate);
        plateSprite.position.set(x, y);
        plateSprite.width = size;
        plateSprite.height = size;
        plateSprite.interactive = true;
        plateSprite.buttonMode = true;
        plateSprite.on('pointerdown', (event) => this.openCrystal(event.global, index)); // Обработчик клика
        
        return plateSprite;
    }

    // Создание спрайта кристалла (изначально невидим)
    createCrystalSprite({ x, y, size }, crystalType) {
        const crystalSprite = new Sprite(this.textures[crystalType]);
        crystalSprite.position.set(x, y);
        crystalSprite.width = size;
        crystalSprite.height = size;
        crystalSprite.visible = false; // Изначально скрыт
        
        return crystalSprite;
    }

    // Обработчик открытия кристалла по клику на плитку
    openCrystal(event, index) {
        const crystalType = this.crystalsArray[index];
        const crystalSprite = this.crystalSprites[index];
        const plateSprite = this.plateSprites[index];

        crystalSprite.visible = true; // Показываем кристалл
        plateSprite.visible = false; // Скрываем плитку

        const mouse = { x: event.x, y: event.y };
        
        // Обновляем прогресс
        this.game.progress[crystalType]++;
        this.game.checkProgress(mouse); // Проверка обновленного прогресса
    }

    // Размещение кристаллов и плиток на сцене
    place() {
        this.clear(); // Удаляем старые спрайты перед созданием новых

        this.data.forEach((info, index) => {
            const plateSprite = this.createPlateSprite(info, index); // Создаем плитку
            const crystalSprite = this.createCrystalSprite(info, this.crystalsArray[index]); // Создаем кристалл

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

    // Обработка изменения размеров экрана
    resize() {
        this.dimensionsManager.updateWidth(this.app.screen.width);
        this.dimensions = this.dimensionsManager.calculateGridDimensions(); // Пересчитываем размеры ячеек и отступов
        
        this.data = this.generateData(); // Пересчитываем позиции

        // Обновляем позиции для всех плиток и кристаллов

        for(let i = 0; i < this.plateSprites.length; i++){
            this.spriteResize(this.plateSprites[i], this.data[i])
            this.spriteResize(this.crystalSprites[i], this.data[i])
        }
    }

    // Перезапуск игры: обновляем массив кристаллов и позиции
    restart(){
        this.crystalsArray = this.generateCrystalsArray(); // Генерация массива кристаллов
        this.data = this.generateData(); // Рассчитываем позиции
    }

    // Очистка старых спрайтов с экрана
    clear() {
        [...this.plateSprites, ...this.crystalSprites].forEach((sprite) => {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
        });

        this.plateSprites = [];
        this.crystalSprites = [];
    }
}
