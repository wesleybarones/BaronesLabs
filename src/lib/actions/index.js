// Registro das ações. Para criar uma ação nova: crie o arquivo e adicione aqui.
// Contrato: action(step, ctx) → gsap.timeline  ·  action.prepare?(step, ctx) esconde o estado inicial.
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
import exit from './exit.js';
import fill from './fill.js';
import flash from './flash.js';
import deployToast from './deployToast.js';
import mark from './mark.js';
import scan from './scan.js';
import swipe from './swipe.js';

export const actions = { move, click, draw, type, select, copy, drag, snap, reveal, status, exit, fill, flash, deployToast, mark, scan, swipe };
