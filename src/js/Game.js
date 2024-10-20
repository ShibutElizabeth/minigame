import { Application, Sprite } from 'pixi.js';
import Loader from './Loader';
import ProgressBars from './ProgressBars';
import Grid from './Grid';
import { crystalTypes } from "./constants";

export default class Game {
    constructor() {
        this.app = new Application();
        this.backgroundTexture = null;
        this.loader = new Loader();

        this.progress = {
            yellow: 0,
            red: 0,
            blue: 0,
            green: 0,
            purple: 0,
        };
        this.restartButtons = document.querySelectorAll('.restart_button');
        this.popup = document.querySelector('.popup');
        this.setupRestartButtons();
        this.addCanvas();
        this.createBackground(); // Загружаем фон
    }

    setupRestartButtons(){
        this.restartButtons.forEach((button) => {
            button.addEventListener('click', this.restart.bind(this));
        });
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
                const winImg = document.querySelector('.popup__image');
                winImg.style.backgroundImage = `url(../../${key}.png)`
                this.popup.style.display = 'flex';
                break; // Прерываем цикл, если игра перезапускается
            }
        }
    }

    async setup() {
        this.grid = new Grid(this.app, this);
        this.progressBars = new ProgressBars(this.app);

        // Загружаем текстуры кристаллов
        await Promise.all([
            this.grid.loadTextures(),
            this.progressBars.loadTextures()
        ]);
        

        // Размещаем ячейки на сцене только после загрузки текстур
        this.grid.placeCells();
        this.progressBars.place();

    }

    restart(){
        this.popup.style.display = 'none';
        this.progress = this.initializeProgress();
        this.grid.restart();
        this.grid.placeCells();
        this.progressBars.restart(this.progress);
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

    // Метод для изменения размера фона
    resizeBackground(background) {
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        this.width = this.app.screen.width;
        this.progressBars.updateMiniCrystals(this.progress);
    }
}
