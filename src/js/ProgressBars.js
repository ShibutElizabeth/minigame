import { Sprite } from 'pixi.js';
import Loader from './Loader';
import { crystalTypes } from './constants'; // Предположим, что crystalTypes хранит массив ['yellow', 'red', 'blue', 'green', 'purple']

export default class ProgressBars {
    constructor(app) {
        this.app = app;
        this.width = this.app.screen.width;
        this.columns = 5;

        this.loader = new Loader();
        this.bars = null;

        this.progressBarSprites = []; // Список для хранения спрайтов прогресс-баров
        this.calculateSizes(this.width); // Вызываем при инициализации

        window.addEventListener('resize', this.onResize.bind(this));
    }

    // Асинхронная загрузка текстур прогресс-баров
    async loadProgressBarsTextures() {
        if (!this.bars) {
            this.bars = await this.loader.loadProgressBars();
        }
    }

    // Рассчитываем отступы и размеры элементов
    calculateSizes(width) {
        this.margin = { top: 0.012 * width, left: 0.117 * width };
        this.barSize = { width: 0.154 * width, height: 0.0668 * width };
    }

    // Размещаем прогресс-бары на сцене
    placeProgressBars() {
        // Удаляем старые спрайты перед пересчетом позиций
        this.progressBarSprites.forEach(sprite => this.app.stage.removeChild(sprite));
        this.progressBarSprites = [];

        // Размещаем новые спрайты
        for (let col = 0; col < this.columns; col++) {
            const barSprite = new Sprite(this.bars[crystalTypes[col]]);
            barSprite.x = this.margin.left + col * (this.barSize.width + 0.02 * this.width); // Добавим небольшой отступ между столбцами
            barSprite.y = this.margin.top;
            barSprite.width = this.barSize.width;
            barSprite.height = this.barSize.height;

            this.progressBarSprites.push(barSprite);
            this.app.stage.addChild(barSprite);
        }
    }

    // Пересчитываем позиции и размеры на изменение окна
    onResize() {
        this.width = this.app.screen.width;
        this.calculateSizes(this.width); // Пересчитываем размеры

        // Перерасполагаем прогресс-бары после ресайза
        this.placeProgressBars();
    }
}
