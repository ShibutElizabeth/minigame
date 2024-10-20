import { Application, Sprite } from 'pixi.js';
import Loader from './Loader';
import ProgressBars from './ProgressBars';
import Grid from './Grid';
import RestartButton from './Restart';
import { crystalTypes } from "./constants";

export default class Game {
    constructor() {
        this.app = new Application();
        this.backgroundTexture = null;
        this.restartButtonTexture = null;
        this.loader = new Loader();

        this.progress = {
            yellow: 0,
            red: 0,
            blue: 0,
            green: 0,
            purple: 0,
        };
        this.addCanvas();
        this.createBackground(); // Загружаем фон
    }

    // Initialize progress for each crystal type
    initializeProgress() {
        return crystalTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {});
    }

    // Метод для проверки прогресса
    checkProgress() {
        this.progressBars.updateMiniCrystals(this.progress);
        for (const key in this.progress) {
            if (this.progress[key] >= 3) {
                console.log(`Все ${key} кристаллы открыты! Перезапуск игры...`);
                // this.restartGame();
                break; // Прерываем цикл, если игра перезапускается
            }
        }
    }

    async setup() {
        this.grid = new Grid(this.app, this);
        this.progressBars = new ProgressBars(this.app);
        this.restartButton = new RestartButton(this.app);

        // Загружаем текстуры кристаллов
        await Promise.all([
            this.grid.loadTextures(),
            this.progressBars.loadTextures(),
            this.restartButton.loadTexture()
        ]);
        

        // Размещаем ячейки на сцене только после загрузки текстур
        this.grid.placeCells();
        this.progressBars.place();
        this.restartButton.place();

        this.restartButton.sprite.on('pointerdown', () => {
            this.restartGame(); // Сброс игры при нажатии
        });
    }

    restartGame(){
        this.initializeProgress();
        this.grid.restart();
        this.grid.placeCells();
        // this.progressBars.reset();
    }

    async addCanvas() {
        await this.app.init({ background: '#1099bb', resizeTo: window });
        document.body.appendChild(this.app.canvas);
        this.width = this.app.screen.width;
        this.height = this.app.screen.height;
        await this.setup();
    }

    async createBackground() {
        if (!this.backgroundTexture) {
            this.backgroundTexture = await this.loader.loadBackground();
        }

        // Создаем спрайт на основе текстуры
        const background = new Sprite(this.backgroundTexture);

        // Устанавливаем размер спрайта по размеру канваса
        background.width = this.width;
        background.height = this.height;

        // Добавляем фон на сцену
        this.app.stage.addChildAt(background, 0);
        // Обновляем размер фона при изменении размера окна
        window.addEventListener('resize', () => this.resizeBackground(background));
    }

    async loadRestartButton() {
        if (!this.restartButtonTexture) {
            this.restartButtonTexture = await this.loader.loadRestartButton();
        }
    }

    // Метод для изменения размера фона
    resizeBackground(background) {
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        this.width = this.app.screen.width;
    }

    placeRestartButton(){
        const restartButtonSprite = new Sprite(this.restartButtonTexture);
        restartButtonSprite.x = 0.8368 * this.width;
        restartButtonSprite.y = 0.388 * this.width;
        restartButtonSprite.width = 0.147 * this.width;
        restartButtonSprite.height = 0.0564 * this.width;
        this.app.stage.addChild(restartButtonSprite);
    }
}
