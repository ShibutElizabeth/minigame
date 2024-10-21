export default class ProgressTextManager {
    constructor(progressTexts) {
        this.progressTexts = progressTexts;
    }

    // Обновление текста прогресса
    updateProgress(key, value) {
        if (this.progressTexts.has(key)) {
            this.progressTexts.get(key).textContent = `Progress ${value}/3`;
        }
    }

    // Сброс всех текстов
    resetProgress() {
        for (const [key, textElement] of this.progressTexts.entries()) {
            textElement.textContent = `Progress 0/3`;
        }
    }
}
