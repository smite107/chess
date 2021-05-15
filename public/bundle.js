!function(e){var t={};function o(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(r,s,function(t){return e[t]}.bind(null,s));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=4)}([function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CONSTANTS=void 0,t.CONSTANTS={BOARD_SIZE:8,CELL_SIZE:50,LETTERS_START_CODE:"a".charCodeAt(0)}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PlayerColor=t.FigureType=void 0,function(e){e.King="king",e.Queen="queen",e.Rook="rook",e.Bishop="bishop",e.Knight="knight",e.Pawn="pawn"}(t.FigureType||(t.FigureType={})),function(e){e.White="white",e.Black="black"}(t.PlayerColor||(t.PlayerColor={}))},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Figure=void 0;const r=o(3),s=o(0),{CELL_SIZE:i}=s.CONSTANTS;t.Figure=class{constructor(e){this.$el=null,this.cell=e.cell,this.color=e.color,this.type=e.type,this.initHTMLElement()}initHTMLElement(){this.$el=r.createDiv(`Chess__figure Chess__figure--${this.color.toString()} \n            ${null!==this.type?"Chess__figure--"+this.type.toString():""}`),this.updatePosition()}updatePosition(){null!==this.$el&&(this.$el.style.top=String(i*(this.cell.row+1))+"px",this.$el.style.left=String(i*(this.cell.col+1))+"px")}move(e){this.cell=e,this.updatePosition()}}},function(e,t,o){"use strict";function r(e,t=""){const o=document.createElement(e);return t&&(o.className=t),o}Object.defineProperty(t,"__esModule",{value:!0}),t.createDiv=t.createElement=void 0,t.createElement=r,t.createDiv=function(e=""){return r("div",e)}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=o(5),s=document.getElementById("root");if(s){const e=new r.App({root:s});console.log(e)}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.App=void 0;const r=o(1),s=o(6),i=o(14),l=o(0),{BOARD_SIZE:n}=l.CONSTANTS;t.App=class{constructor(e){this.$root=e.root,this.players={[r.PlayerColor.White]:new i.Player({color:r.PlayerColor.White}),[r.PlayerColor.Black]:new i.Player({color:r.PlayerColor.Black})},this.board=new s.Board({root:this.$root}),this.createFiguresForPlayer(this.players[r.PlayerColor.Black]),this.createFiguresForPlayer(this.players[r.PlayerColor.White])}createFiguresForPlayer(e){const{color:t}=e,o=t===r.PlayerColor.Black;let s=o?0:n-1;const i=[r.FigureType.Rook,r.FigureType.Knight,r.FigureType.Bishop,r.FigureType.Queen,r.FigureType.King,r.FigureType.Bishop,r.FigureType.Knight,r.FigureType.Rook];for(let e=0;e<n;e++)this.board.createFigure(i[e],t,{row:s,col:e});s+=o?1:-1;for(let e=0;e<n;e++)this.board.createFigure(r.FigureType.Pawn,t,{row:s,col:e})}}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Board=void 0;const r=o(0),s=o(3),i=o(7),{BOARD_SIZE:l,CELL_SIZE:n,LETTERS_START_CODE:c}=r.CONSTANTS;t.Board=class{constructor(e){this.cells=[],this.$board=null,this.$figures=null,this.createBoard(),this.createFiguresList(),null!==this.$board&&e.root.append(this.$board)}onBoardClick(e){this.getCellFromMouseEvent(e)}getBoardCell(e){return this.cells[e.row][e.col]}getCellFromMouseEvent(e){var t;const o=null===(t=this.$board)||void 0===t?void 0:t.getBoundingClientRect();if(!o)return null;let r=e.clientX-o.left,s=e.clientY-o.top;return r<n||s<n||r>n*(l+1)||s>n*(l+1)?null:(s-=n,r-=n,{row:Math.floor(s/n),col:Math.floor(r/n)})}highlightCells(e){var t;null===(t=this.$board)||void 0===t||t.querySelectorAll(".Chess__cell--highlighted").forEach(e=>{e.classList.remove("Chess__cell--highlighted")}),e.forEach(e=>{const{$cell:t}=this.getBoardCell(e);t.classList.add("Chess__cell--highlighted")})}createBoard(){this.$board=s.createDiv("Chess__board");const e=s.createDiv("Chess__row");this.$board.append(e);const t=s.createDiv("Chess__cell");e.append(t);for(let t=0;t<l;t++){const o=s.createDiv("Chess__cell Chess__cell--heading");o.textContent=String.fromCharCode(c+t),e.append(o);const r=s.createDiv("Chess__row"),i=s.createDiv("Chess__cell Chess__cell--heading");i.textContent=String(l-t),r.append(i),this.cells.push([]);for(let e=0;e<l;e++){const e=s.createDiv("Chess__cell Chess__cell--main");r.append(e),this.cells[t].push({$cell:e,figure:null})}r.append(i.cloneNode(!0)),this.$board.append(r)}e.append(t.cloneNode()),this.$board.append(e.cloneNode(!0))}createFiguresList(){var e;this.$figures=s.createDiv("Chess__figures"),null===(e=this.$board)||void 0===e||e.append(this.$figures)}createFigure(e,t,o){var r;const s=new i.figures[e]({color:t,cell:o});null!==s.$el&&(null===(r=this.$figures)||void 0===r||r.append(s.$el)),this.getBoardCell(o).figure=s}}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.figures=void 0;const r=o(1),s=o(8),i=o(9),l=o(10),n=o(11),c=o(12),u=o(13);t.figures={[r.FigureType.King]:s.King,[r.FigureType.Queen]:i.Queen,[r.FigureType.Rook]:l.Rook,[r.FigureType.Bishop]:n.Bishop,[r.FigureType.Knight]:c.Knight,[r.FigureType.Pawn]:u.Pawn}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.King=void 0;const r=o(1),s=o(2),i=o(0),{BOARD_SIZE:l}=i.CONSTANTS;class n extends s.Figure{constructor(e){super(Object.assign(Object.assign({},e),{type:r.FigureType.King}))}getCellsToMove(e){const t=[],{col:o,row:r}=e;for(let e=r-1;e<=r+1;e++)for(let s=o-1;s<=o+1;s++)e>-1&&s>-1&&e<l&&s<l&&(e!==o||s!==r)&&t.push({row:e,col:s});return t}}t.King=n},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Queen=void 0;const r=o(1),s=o(2),i=o(0),{BOARD_SIZE:l}=i.CONSTANTS;class n extends s.Figure{constructor(e){super(Object.assign(Object.assign({},e),{type:r.FigureType.Queen}))}getCellsToMove(e){const t=[],{col:o,row:r}=e;for(let e=0;e<l;e++)for(let s=0;s<l;s++)e-s!=r-o&&e+s!==o+r&&e!==r&&s!==o||e===r&&s===o||t.push({row:e,col:s});return t}}t.Queen=n},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Rook=void 0;const r=o(1),s=o(2),i=o(0),{BOARD_SIZE:l}=i.CONSTANTS;class n extends s.Figure{constructor(e){super(Object.assign(Object.assign({},e),{type:r.FigureType.Rook}))}getCellsToMove(e){const t=[],{col:o,row:r}=e;for(let e=0;e<l;e++)e!==o&&t.push({row:r,col:e});for(let e=0;e<l;e++)e!==r&&t.push({row:e,col:o});return t}}t.Rook=n},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Bishop=void 0;const r=o(1),s=o(2),i=o(0),{BOARD_SIZE:l}=i.CONSTANTS;class n extends s.Figure{constructor(e){super(Object.assign(Object.assign({},e),{type:r.FigureType.Bishop}))}getCellsToMove(e){const t=[],{col:o,row:r}=e;for(let e=0;e<l;e++)for(let s=0;s<l;s++)e-s!=r-o&&e+s!==o+r||e===r&&s===o||t.push({row:e,col:s});return t}}t.Bishop=n},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Knight=void 0;const r=o(1),s=o(2),i=o(0),{BOARD_SIZE:l}=i.CONSTANTS;class n extends s.Figure{constructor(e){super(Object.assign(Object.assign({},e),{type:r.FigureType.Knight}))}getCellsToMove(e){const t=[],{col:o,row:r}=e,s=Math.max(o-2,0),i=Math.max(r-2,0),n=Math.min(o+2,l-1),c=Math.min(r+2,l-1);for(let e=i;e<=c;e++)for(let i=s;i<=n;i++)Math.abs(e-r)+Math.abs(i-o)===3&&t.push({row:e,col:i});return t}}t.Knight=n},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Pawn=void 0;const r=o(1),s=o(2),i=o(0),{BOARD_SIZE:l}=i.CONSTANTS;class n extends s.Figure{constructor(e){super(Object.assign(Object.assign({},e),{type:r.FigureType.Pawn}))}getCellsToMove(e){const t=[],{col:o,row:s}=e;return t.push({row:s+(this.color===r.PlayerColor.Black?1:-1),col:o}),t}}t.Pawn=n},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Player=void 0;t.Player=class{constructor(e){this.figures=[],this.color=e.color}}}]);
//# sourceMappingURL=bundle.js.map