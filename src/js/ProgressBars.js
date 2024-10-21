import { Sprite } from 'pixi.js';
import gsap from 'gsap';
import Loader from './Loader';
import { crystalTypes } from './constants'; // Предположим, что crystalTypes хранит массив ['yellow', 'red', 'blue', 'green', 'purple']

export default class ProgressBars {
    constructor(app) {
        this.app = app;
        this.width = this.app.screen.width;
        this.columns = 5;

        this.loader = new Loader();
        this.textures = null;
        this.minicrystals = null;
        this.positions = [];

        this.sprites = []; // Список для хранения спрайтов прогресс-баров
        this.minisprites = [];
        this.calculateSizes(this.width); // Вызываем при инициализации

        window.addEventListener('resize', this.onResize.bind(this));
    }

    // Асинхронная загрузка текстур прогресс-баров
    async loadTextures() {
        if (!this.textures) {
            this.textures = await this.loader.loadProgressBars();
        }
        if (!this.minicrystals) {
            this.minicrystals = await this.loader.loadMiniCrystals();
        }
    }

    // Рассчитываем отступы и размеры элементов
    calculateSizes(width) {
        this.barMargin = { top: 0.012 * width, left: 0.12 * width };
        this.barSize = { width: 0.154 * width, height: 0.0668 * width };
        this.miniMargin = {
            left: 0.1935 * this.width,
            top: 0.01585 * this.width
        };
        this.miniPadding = {
            left: 0.00945 * this.width,
            between: 0.154 * this.width
        };
        this.miniSize = {
            width: 0.012 * this.width,
            height: 0.012 * this.width
        }
    }

    // Размещаем прогресс-бары на сцене
    place() {
        // Удаляем старые спрайты перед пересчетом позиций
        this.clearSprites();

        // Размещаем новые спрайты
        for (let col = 0; col < this.columns; col++) {
            const barSprite = new Sprite(this.textures[crystalTypes[col]]);
            barSprite.x = this.barMargin.left + col * (this.barSize.width); // Добавим небольшой отступ между столбцами
            barSprite.y = this.barMargin.top;
            barSprite.width = this.barSize.width;
            barSprite.height = this.barSize.height;

            this.sprites.push(barSprite);
            this.app.stage.addChild(barSprite);
        }

        this.placeMinicrystals();
    }

    placeMinicrystals(){
        this.positions = [];
        for(let type = 0; type < this.columns; type++){
            for(let c = 0; c < 3; c++){
                this.positions.push({
                    x: this.miniMargin.left + c * (this.miniPadding.left + this.miniSize.width) + type * this.miniPadding.between,
                    y: this.miniMargin.top,
                    type: type
                })
            }
        }

        this.positions.forEach((el, i) => {
            const sprite = new Sprite(this.minicrystals[crystalTypes[el.type]]);
            sprite.x = el.x;
            sprite.y = el.y;
            sprite.width = this.miniSize.width;
            sprite.height = this.miniSize.height;
            sprite.visible = false;
            this.minisprites.push(sprite);
            this.app.stage.addChild(sprite);
        });
    }

    // Метод для обновления и анимации миникристаллов
    updateMiniCrystals(progress, mouse = null) {
        this.minisprites.forEach((sprite, index) => {
            if (progress) {
                const crystalType = crystalTypes[Math.floor(index / 3)]; // Определяем тип кристалла
                const crystalProgress = progress[crystalType];

                // Если прогресс больше, чем позиция текущего миникристалла, и он еще не видим
                if (!sprite.visible && crystalProgress > (index % 3)) {
                    // Если переданы координаты клика, запускаем анимацию
                    if (mouse) {
                        const targetX = this.positions[index].x;
                        const targetY = this.positions[index].y;
                        this.animateMiniCrystal(mouse.x, mouse.y, targetX, targetY, crystalType);
                    } else {
                        // Если нет анимации, просто делаем видимым
                        sprite.visible = true;
                    }
                }
            } else {
                // Если прогресса нет, скрываем кристалл
                sprite.visible = false;
            }
        });
    }


    clearSprites() {
        // Удаляем старые спрайты прогресс-баров и миникристаллов
        this.sprites.forEach(sprite => this.app.stage.removeChild(sprite));
        this.minisprites.forEach(sprite => this.app.stage.removeChild(sprite));
        this.sprites = [];
        this.minisprites = [];
    }

    animateMiniCrystal(startX, startY, targetX, targetY, crystalType) {
        // Создаем спрайт миникристалла на позиции клика
        const miniCrystal = new Sprite(this.minicrystals[crystalType]);
        miniCrystal.x = startX;
        miniCrystal.y = startY;
        miniCrystal.width = this.miniSize.width;
        miniCrystal.height = this.miniSize.height;

        // Добавляем миникристалл на сцену
        this.app.stage.addChild(miniCrystal);

        // Анимация перемещения от позиции клика до позиции в прогресс-баре
        gsap.timeline().to(miniCrystal, {
            x: targetX,
            y: targetY,
            duration: 0.5, // Длительность анимации в секундах
            ease: 'power1.inOut', // Более естественное ускорение
            onComplete: () => {
                // Удаляем миникристалл после завершения анимации
                this.app.stage.removeChild(miniCrystal);

                // Делаем целевой миникристалл в прогресс-баре видимым
                const targetMiniSprite = this.minisprites.find(sprite => sprite.x === targetX && sprite.y === targetY);
                if (targetMiniSprite) {
                    targetMiniSprite.visible = true;
                }
            }
        });
    }

    // Пересчитываем позиции и размеры на изменение окна
    onResize() {
        this.width = this.app.screen.width;
        this.calculateSizes(this.width); // Пересчитываем размеры

        // Перерасполагаем прогресс-бары после ресайза
        this.place();
    }

    restart(){
        this.updateMiniCrystals();
    }
}
