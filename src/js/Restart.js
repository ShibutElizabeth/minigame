import { Sprite } from 'pixi.js';
import Loader from './Loader';

export default class RestartButton {
    constructor(app) {
        this.app = app;
        this.width = this.app.screen.width;

        this.loader = new Loader();
        this.button = null;

        this.sprite = null; // Список для хранения спрайтов прогресс-баров
        this.calculateSizes(this.width); // Вызываем при инициализации

        window.addEventListener('resize', this.onResize.bind(this));
    }

    // Асинхронная загрузка текстур прогресс-баров
    async loadTexture() {
        if (!this.button) {
            this.button = await this.loader.loadRestartButton();
        }
    }

    // Рассчитываем отступы и размеры элементов
    calculateSizes(width) {
        this.margin = { top: 0.388 * width, left: 0.8368 * width };
        this.buttonSize = { width: 0.147 * width, height: 0.0564 * width };
    }

    // Размещаем прогресс-бары на сцене
    place() {
        // Удаляем старые спрайты перед пересчетом позиций
        this.app.stage.removeChild(this.sprite);

        this.sprite = new Sprite(this.button);
        this.sprite.x = this.margin.left;
        this.sprite.y = this.margin.top;
        this.sprite.width = this.buttonSize.width;
        this.sprite.height = this.buttonSize.height;
        this.sprite.tint = 0xe6e6e6;

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;

        this.sprite.on('pointerout', () => {
            this.sprite.tint = 0xe6e6e6; // Изменяем цвет для подсветки
        });

        this.sprite.on('pointerover', () => {
            this.sprite.tint = 0xFFFFFF; // Возвращаем цвет обратно
            this.sprite.cursor = 'pointer';
        });

        this.sprite.on('pointerdown', () => {
            this.sprite.tint = 0xaaaaaa; // Возвращаем цвет обратно
            this.sprite.cursor = 'pointer';
        });

        this.app.stage.addChild(this.sprite);
    }

    // Пересчитываем позиции и размеры на изменение окна
    onResize() {
        this.width = this.app.screen.width;
        this.calculateSizes(this.width); // Пересчитываем размеры

        // Перерасполагаем прогресс-бары после ресайза
        this.place();
    }
}
