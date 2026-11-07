// Ações usadas pela montagem do herói. Para criar uma nova: crie o arquivo e registre aqui.
// Contrato: action(step, ctx) → gsap.timeline · action.prepare?(step, ctx) esconde o estado inicial.
import move from './move.js';
import click from './click.js';
import draw from './draw.js';
import type from './type.js';
import select from './select.js';
import copy from './copy.js';
import drag from './drag.js';
import snap from './snap.js';
import reveal from './reveal.js';
import status from './status.js';
import fill from './fill.js';
import flash from './flash.js';
import deployToast from './deployToast.js';
import exit from './exit.js';

export const actions = { move, click, draw, type, select, copy, drag, snap, reveal, status, fill, flash, deployToast, exit };
