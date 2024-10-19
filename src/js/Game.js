import { Application, Sprite, Assets } from 'pixi.js';
import backgroundImage from '../static/bg.png';
import { crystalPaths } from './constants';
import yellowImage from '../static/yellow.png';
import redImage from '../static/red.png';
import blueImage from '../static/blue.png';
import greenImage from '../static/green.png';
import purpleImage from '../static/purple.png';
import plateImage from '../static/plate.png';

export default class Game {
    constructor() {
        const { width, height } = document.body.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.rows = 3;
        this.cols = 5;
        this.app = new Application();
        this.addCanvas();
        this.loadBackground(); // Загружаем фон
        this.loadCrystals();
        
    }

    async addCanvas() {
        await this.app.init({ background: '#1099bb', resizeTo: window });
        document.body.appendChild(this.app.canvas);
    }

    async loadBackground() {
        // Загружаем текстуру для фона
        const backgroundTexture = await Assets.load(backgroundImage);
        
        // Создаем спрайт на основе текстуры
        const background = new Sprite(backgroundTexture);

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
    }

    // Функция для загрузки всех изображений кристаллов и их обратной стороны
    async loadCrystals() {
        try {
            // const textures = await Assets.load(Object.values(crystalPaths));
            const textures = await Promise.all([
                Assets.load(yellowImage),
                Assets.load(redImage),
                Assets.load(blueImage),
                Assets.load(greenImage),
                Assets.load(purpleImage),
                Assets.load(plateImage)
            ]);
            this.crystals = {
                yellow: textures[0],
                red: textures[1],
                blue: textures[2],
                green: textures[3],
                purple: textures[4],
                plate: textures[5]
            };

            console.log(this.crystals);
            this.createGrid();
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    }

    createGrid() {
        const positions = [];
        // const rows = 3;
        // const cols = 5;
        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const marginW = 0.167 * width;
        const marginH = 0.204 * height;
        const paddingW = 0.045 * width;
        const paddingH = 0.059 * height;


        const cellSize = 0.095 * width;
        // const cellHeight = 0.095 * width;

        // Генерация массива позиций для 5x3 сетки
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                positions.push({
                    x: marginW + col * (cellSize + paddingW),
                    y: marginH + row * (cellSize + paddingH)
                });
            }
        }

        // Создаем массив кристаллов с 3 каждого типа
        const crystalTypes = ['yellow', 'red', 'blue', 'green', 'purple'];
        const crystalsArray = [];
        crystalTypes.forEach(type => {
            for (let i = 0; i < 3; i++) {
                crystalsArray.push(type);
            }
        });

        // Перемешиваем массив кристаллов
        this.shuffleArray(crystalsArray);

        // Размещаем кристаллы на сцене
        this.placeCrystals(positions, crystalsArray);
    }

    // Функция для перемешивания массива
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Функция для размещения кристаллов на сцене
    placeCrystals(positions, crystalsArray) {
        positions.forEach((position, index) => {
            // Создаем спрайт для каждой панели
            const plateSprite = new Sprite(this.crystals.plate);
            plateSprite.x = position.x;
            plateSprite.y = position.y;
            plateSprite.width = 0.095 * this.app.screen.width;
            plateSprite.height = 0.095 * this.app.screen.width;
            // plateSprite.anchor.set(0.5); // Центрируем спрайт
            // plateSprite.visible = false;
            this.app.stage.addChild(plateSprite);

            // Создаем спрайт кристалла, который будет под plate
            const crystalSprite = new Sprite(this.crystals[crystalsArray[index]]);
            crystalSprite.x = position.x;
            crystalSprite.y = position.y;
            crystalSprite.width = 0.095 * this.app.screen.width;
            crystalSprite.height = 0.095 * this.app.screen.width;
            // crystalSprite.anchor.set(0.5);
            crystalSprite.visible = false; // Скрываем кристалл под plate
            this.app.stage.addChild(crystalSprite);
        });
    }

    placeProgressBars() {
        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const padding = 0.006 * width;
        const marginH = 0.0445 * height;
        const marginW = 0.119 * width;
        const barWidth = 0.145 * width;
        const barHeight = 0.0566 * width;
        for (let row = 0; row < this.rows; row++) {
            const barSprite = new Sprite();
            barSprite.x = marginW + row * (padding + barWidth);
            barSprite.y = marginH;
            barSprite.width = barWidth;
            barSprite.height = barHeight;
            // plateSprite.anchor.set(0.5); // Центрируем спрайт
            // plateSprite.visible = false;
            this.app.stage.addChild(barSprite);
        }
    }
}
