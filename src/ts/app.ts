import { AppParams, Cell, IFigure, FigureType, FiguresList, Player, BoardCell } from './types';
import { FigureKing } from './figures';
import { CONSTANTS } from './constants';

const { BOARD_SIZE, CELL_SIZE, LETTERS_START_CODE } = CONSTANTS;

const figures = {
    [FigureType.King]: FigureKing,
}

export class App {
    board: ((BoardCell)[])[] = [];

    $root: HTMLElement;
    $board: HTMLElement | null = null;
    $figures: HTMLElement | null = null;

    constructor(props: AppParams) {
        this.$root = props.root;
        this.createBoard();
        this.createFigures();
    }

    convertCoordsToCell(x: number, y: number): Cell | null {
        if (
            x < CELL_SIZE || y < CELL_SIZE ||
            x > CELL_SIZE * (BOARD_SIZE + 1) || y > CELL_SIZE * (BOARD_SIZE + 1)
        ) return null;

        // remove headings offsets
        y -= CELL_SIZE;
        x -= CELL_SIZE;

        return { row: Math.floor(y / CELL_SIZE), col: Math.floor(x / CELL_SIZE) };
    }

    getBoardCell(cell: Cell): BoardCell {
        return this.board[cell.row][cell.col];
    }

    onBoardClick(event: MouseEvent): void {
        const rect = this.$board?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cell = this.convertCoordsToCell(x, y);

        if (cell === null) return;

        const { figure } = this.getBoardCell(cell);
        if (figure !== null) {
            this.highlightCells(figure.getCellsToMove(cell));
        }
    }

    createFigures(): void {
        this.$figures = this.newDiv('Chess__figures');
        this.$board?.append(this.$figures);

        this.addFigureOnBoard(FigureType.King, Player.White, { row: 5, col: 5 });
    }

    highlightCells(cells: Cell[]): void {
        this.$board?.querySelectorAll('Chess__cell--highlighted').forEach(($el) => {
            $el.classList.remove('Chess__cell--highlighted');
        });

        cells.forEach(cell => {
            const { $cell } = this.getBoardCell(cell);
            $cell.classList.add('Chess__cell--highlighted');
        });
    }

    addFigureOnBoard(type: FigureType, player: Player, cell: Cell): void {
        const $figure = this.newDiv(
            `Chess__figure Chess__figure--${player.toString()} Chess__figure--${type.toString()}`);
        $figure.style.left = `${String(CELL_SIZE * (cell.row + 1))}px`;
        $figure.style.top = `${String(CELL_SIZE * (cell.col + 1))}px`;
        this.$figures?.append($figure);

        this.getBoardCell(cell).figure = new figures[type]();
    }

    createBoard(): void {
        this.$board = this.newDiv('Chess__board');
        this.$board.addEventListener('click', this.onBoardClick.bind(this));

        // create letters row
        const $lettersRow = this.newDiv('Chess__row');
        this.$board.append($lettersRow);

        // create empty cell for spacing and add it to start of letters headings
        const $emptyCell = this.newDiv('Chess__cell');
        $lettersRow.append($emptyCell);

        for (let i = 0; i < BOARD_SIZE; i++) {
            // create heading letter cells
            const $letterCell = this.newDiv('Chess__cell Chess__cell--heading');
            $letterCell.textContent = String.fromCharCode(LETTERS_START_CODE + i);
            $lettersRow.append($letterCell);

            // create row
            const $row = this.newDiv('Chess__row');

            // create heading number cell
            const $numberCell = this.newDiv('Chess__cell Chess__cell--heading');
            $numberCell.textContent = String(BOARD_SIZE - i);
            $row.append($numberCell);

            // create row in virtual copy of board
            this.board.push([]);

            // create main chess cells
            for (let j = 0; j < BOARD_SIZE; j++) {
                const $cell = this.newDiv('Chess__cell Chess__cell--main');
                $row.append($cell);

                // create place for figures in virtual copy of board
                this.board[i].push({ $cell, figure: null });
            }

            $row.append($numberCell.cloneNode(true));
            this.$board.append($row);
        }

        // add empty cell to end of letters headings
        $lettersRow.append($emptyCell.cloneNode());
        this.$board.append($lettersRow.cloneNode(true));

        this.$root.append(this.$board);
    }

    getElement(query: string): HTMLElement | null {
        return this.$root.querySelector(query);
    }

    createElement(tag: string, className = ''): HTMLElement {
        const el = document.createElement(tag);
        if (className) {
            el.className = className;
        }
        return el;
    }

    newDiv(className = ''): HTMLElement {
        return this.createElement('div', className);
    }
}