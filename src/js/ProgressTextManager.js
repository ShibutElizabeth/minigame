export default class ProgressTextManager {
    constructor(progressTexts) {
        this.progressTexts = progressTexts;
    }

    // Обновление текста прогресса
    updateProgress(key, value) {
        const inner = `Progress\n${value}/3`;
        if (this.progressTexts.has(key)) {
            this.progressTexts.get(key).text = inner.toUpperCase();
        }
    }

    // Сброс всех текстов
    resetProgress() {
        const inner = `Progress\n0/3`
        for (const [key, textElement] of this.progressTexts.entries()) {
            textElement.text = inner.toUpperCase();
        }
    }
}