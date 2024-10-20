import { Sprite } from 'pixi.js';
import Loader from './Loader';
import { crystalTypes } from "./constants";

export default class Grid {
    constructor(app, game) {
        this.app = app;
        this.columns = 5;
        this.rows = 3;
        this.width = this.app.screen.width;
        
        this.calculateSizes(this.width);
        this.crystalsArray = [];
        this.crystalSprites = [];
        this.plateSprites = [];
        this.positions = [];
        this.game = game;
        this.restart();

        this.loader = new Loader();
        this.textures = null;
        
        window.addEventListener('resize', this.onResize.bind(this));
    }

    // Asynchronously load crystal textures
    async loadTextures() {
        if(!this.textures){
            this.textures = await this.loader.loadCrystals();
        }
    }

    // Calculate margin, padding, and cell sizes based on screen width
    calculateSizes(width) {
        this.margin = { top: 0.0866 * width, left: 0.1575 * width };
        this.padding = { top: 0.0282 * width, left: 0.044 * width };
        this.cellSize = 0.0974 * width;
    }

    // Generate positions for the 5x3 grid based on margins and paddings
    calculatePositions() {
        const positions = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                positions.push({
                    x: this.margin.left + col * (this.cellSize + this.padding.left),
                    y: this.margin.top + row * (this.cellSize + this.padding.top),
                });
            }
        }

        return positions;
    }

    // Recalculate positions on window resize
    onResize() {
        this.width = this.app.screen.width;
        this.calculateSizes(this.width); // Пересчитываем размеры ячеек и отступы
        this.positions = this.calculatePositions(); // Пересчитываем позиции

        // Обновляем позиции для всех плиток и кристаллов
        this.plateSprites.forEach((plateSprite, index) => {
            const position = this.positions[index];
            plateSprite.position.set(position.x, position.y);
            plateSprite.width = this.cellSize;
            plateSprite.height = this.cellSize;
        });

        this.crystalSprites.forEach((crystalSprite, index) => {
            const position = this.positions[index];
            crystalSprite.position.set(position.x, position.y);
            crystalSprite.width = this.cellSize;
            crystalSprite.height = this.cellSize;
        });
    }

    // Create and shuffle crystal array, with 3 crystals of each type
    generateCrystalsArray() {
        const crystalsArray = crystalTypes.flatMap(type => Array(3).fill(type));
        return this.shuffleArray(crystalsArray);
    }

    // Shuffle array using Fisher-Yates algorithm
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Place crystals and plates on the stage
    placeCells() {
        this.clearSprites();

        this.positions.forEach((position, index) => {
            const plateSprite = this.createPlateSprite(position, index);
            const crystalSprite = this.createCrystalSprite(position, this.crystalsArray[index]);

            this.plateSprites.push(plateSprite);
            this.crystalSprites.push(crystalSprite);

            this.app.stage.addChild(plateSprite);
            this.app.stage.addChild(crystalSprite);
        });
    }

    // Create plate sprite with click event listener
    createPlateSprite({ x, y }, index) {
        const plateSprite = new Sprite(this.textures.plate);
        plateSprite.position.set(x, y);
        plateSprite.width = this.cellSize;
        plateSprite.height = this.cellSize;
        plateSprite.interactive = true;
        plateSprite.buttonMode = true;
        plateSprite.on('pointerdown', () => this.openCrystal(index));
        return plateSprite;
    }

    // Create crystal sprite and hide it initially
    createCrystalSprite({ x, y }, crystalType) {
        const crystalSprite = new Sprite(this.textures[crystalType]);
        crystalSprite.position.set(x, y);
        crystalSprite.width = this.cellSize;
        crystalSprite.height = this.cellSize;
        crystalSprite.visible = false; // Initially hidden
        return crystalSprite;
    }

    // Handle opening crystal on plate click
    openCrystal(index) {
        const crystalType = this.crystalsArray[index];
        const crystalSprite = this.crystalSprites[index];
        const plateSprite = this.plateSprites[index];

        crystalSprite.visible = true; // Show crystal
        plateSprite.visible = false; // Hide plate

        // Update progress
        this.game.progress[crystalType]++;
        this.game.checkProgress();
    }

    // Удаление старых спрайтов с экрана
    clearSprites() {
        this.plateSprites.forEach(sprite => {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
        });
        this.crystalSprites.forEach(sprite => {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
        });
        this.plateSprites = [];
        this.crystalSprites = [];
    }

    restart(){
        this.crystalsArray = this.generateCrystalsArray(); // Generate crystal array on init
        this.positions = this.calculatePositions();
    }
}
