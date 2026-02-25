import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

export const createConfig = (parent: HTMLElement): Phaser.Types.Core.GameConfig => ({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    fps: { target: 60, forceSetTimeOut: true }, // M2 Optimization
    scene: [MainScene]
});