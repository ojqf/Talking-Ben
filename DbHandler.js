import { readFileSync, writeFileSync } from 'fs';

export default class DbHandler {
    static STATES_TITLES = {
        WAITING: 'waiting',
        TALKING: 'talking',
        OUT_OF_TALKING: 'out-of-talking',
    };
    static PATH_TO_FILE = './user-states.json';

    states;
    pathToFile;

    constructor(pathToFile = DbHandler.PATH_TO_FILE) {
        this.pathToFile = pathToFile;
        this.states = JSON.parse(readFileSync(this.pathToFile));
    }

    getState(chatId) {
        return this.states[chatId];
    }

    getStates() {
        return this.states;
    }

    setState(chatId, state) {
        if (!this.states[chatId]) this.addUser(chatId);
        this.states[chatId] = state;
        this.saveFile();
    }

    addUser(chatId) {
        if (this.states[chatId]) return;
        this.states[chatId] = DbHandler.STATES_TITLES.WAITING;
        this.saveFile();
    }

    startTalking(chatId) {
        if (!this.states[chatId]) return;
        this.states[chatId] = DbHandler.STATES_TITLES.TALKING;
        this.saveFile();
    }

    stopTalking(chatId) {
        if (!this.states[chatId]) return;
        this.states[chatId] = DbHandler.STATES_TITLES.OUT_OF_TALKING;
        this.saveFile();
    }

    saveFile() {
        writeFileSync(this.pathToFile, JSON.stringify(this.states, null, 2));
    }
}
