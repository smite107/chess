import { Cell, PlayerColor, IFigure, FigureType, BoardCell, MovesList, ObserverEvent } from '../types';
import { CONSTANTS } from '../constants';
import { createDiv, removeClassesFromElements, isMovePossible, isEqualCells } from '../utils';
import { figures } from './figures/figures';
import { observer } from './Observer';

const { BOARD_SIZE, CELL_SIZE, HEADING_CELL_SIZE, LETTERS_START_CODE } = CONSTANTS;
const MOVE_CLASS_NAME = 'Chess__cell--move';
const ATTACK_CLASS_NAME = 'Chess__cell--attack';

type BoardParams = {
    $root: HTMLElement,
}

export class Board {
    cells: ((BoardCell)[])[] = [];
    $el: HTMLElement | null = null;
    $figuresList: HTMLElement | null = null;
    $figures: HTMLElement[] = [];

    onFigureMoveListener: (event: MouseEvent) => void = () => null;

    constructor(params: BoardParams) {
        this.createBoard(params.$root);
        this.createFiguresList();
        this.subscribeEvents();
    }

    subscribeEvents(): void {
        observer.subscribe(ObserverEvent.FigureSelected, this.beReadyToFigureMove.bind(this));
        observer.subscribe(ObserverEvent.FigureMoved, this.updateFigurePosition.bind(this));
        observer.subscribe(ObserverEvent.FigureRemoved, this.removeFigure.bind(this));
    }

    beReadyToFigureMove(figure: IFigure, moves: MovesList): void {
        this.onFigureMoveListener = (event: MouseEvent) => {
            const cell = this.getCellFromMouseEvent(event);

            if (cell === null || isEqualCells(cell, figure.cell)) return;

            if (isMovePossible(moves, cell)) {
                observer.dispatch(ObserverEvent.FigureMoved, figure, cell);
            }

            this.$el?.removeEventListener('click', this.onFigureMoveListener);
        };

        this.$el?.removeEventListener('click', this.onFigureMoveListener);
        this.$el?.addEventListener('click', this.onFigureMoveListener);
    }

    updateFigurePosition(figure: IFigure, newPosition: Cell): void {
        this.stopHighlighting();

        const oldCell = this.getBoardCell(figure.cell);
        const newCell = this.getBoardCell(newPosition);

        if (oldCell === null || newCell === null) return;

        oldCell.figure = null;

        if (newCell.figure !== null) {
            observer.dispatch(ObserverEvent.FigureRemoved, newCell.figure);
        }
        newCell.figure = figure;

        figure.moveTo(newPosition);
    }

    checkCellExisting(cell: Cell): boolean {
        return cell.col >= 0 && cell.row >= 0 && cell.col < BOARD_SIZE && cell.row < BOARD_SIZE;
    }

    getBoardCell(cell: Cell): BoardCell | null {
        if (this.checkCellExisting(cell)) {
            return this.cells[cell.row][cell.col];
        }

        return null;
    }

    getCellFromMouseEvent(event: MouseEvent): Cell | null {
        const rect = this.$el?.getBoundingClientRect();
        if (!rect) return null;

        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (
            x < CELL_SIZE || y < CELL_SIZE ||
            x > CELL_SIZE * (BOARD_SIZE + 1) || y > CELL_SIZE * (BOARD_SIZE + 1)
        ) return null;

        // remove headings offsets
        y -= HEADING_CELL_SIZE;
        x -= HEADING_CELL_SIZE;

        return { row: Math.floor(y / CELL_SIZE), col: Math.floor(x / CELL_SIZE) };
    }

    addClassesToCells(cells: Cell[], className: string): void {
        cells.forEach(cell => {
            const boardCell = this.getBoardCell(cell);
            if (boardCell !== null) {
                const { $cell } = boardCell;
                $cell.classList.add(className);
            }
        });
    }

    stopHighlighting(): void {
        if (this.$el === null) return;

        removeClassesFromElements(this.$el, MOVE_CLASS_NAME);
        removeClassesFromElements(this.$el, ATTACK_CLASS_NAME);
    }

    highlightPossibleMoves(moves: MovesList): void {
        this.stopHighlighting();
        this.addClassesToCells(moves.cellsToMove, MOVE_CLASS_NAME);
        this.addClassesToCells(moves.cellsToAttack, ATTACK_CLASS_NAME);
    }

    createBoard($root: HTMLElement): void {
        this.$el = createDiv('Chess__board');

        // create letters row
        const $lettersRow = createDiv('Chess__row');
        this.$el.append($lettersRow);

        // create empty cell for spacing and add it to start of letters headings
        const $emptyCell = createDiv('Chess__cell Chess__cell--empty');
        $lettersRow.append($emptyCell);

        for (let i = 0; i < BOARD_SIZE; i++) {
            // create heading letter cells
            const $letterCell = createDiv('Chess__cell Chess__cell--heading Chess__cell--headingLetter');
            $letterCell.textContent = String.fromCharCode(LETTERS_START_CODE + i);
            $lettersRow.append($letterCell);

            // create row
            const $row = createDiv('Chess__row');

            // create heading number cell
            const $numberCell = createDiv('Chess__cell Chess__cell--heading Chess__cell--headingNumber');
            $numberCell.textContent = String(BOARD_SIZE - i);
            $row.append($numberCell);

            // create row in virtual copy of board
            this.cells.push([]);

            // create main chess cells
            for (let j = 0; j < BOARD_SIZE; j++) {
                const $cell = createDiv('Chess__cell Chess__cell--main');
                $row.append($cell);

                // create place for figures in virtual copy of board
                this.cells[i].push({ $cell, figure: null });
            }

            $row.append($numberCell.cloneNode(true));
            this.$el.append($row);
        }

        // add empty cell to end of letters headings
        $lettersRow.append($emptyCell.cloneNode());
        this.$el.append($lettersRow.cloneNode(true));
        $root.append(this.$el);
    }

    createFiguresList(): void {
        this.$figuresList = createDiv('Chess__figures');
        this.$el?.append(this.$figuresList);
    }

    createFigure(type: FigureType, color: PlayerColor, cell: Cell): IFigure {
        const figure: IFigure = new figures[type]({ color, cell, board: this });

        if (figure.$el !== null) {
            this.$figures.push(figure.$el);
            this.$figuresList?.append(figure.$el);
        }

        const boardCell = this.getBoardCell(cell);
        if (boardCell !== null) {
            boardCell.figure = figure;
        }

        return figure;
    }

    removeFigure(figure: IFigure): void {
        this.$figures.find(($el) => (
            $el === figure.$el
        ))?.remove();
    }

    getFigureOnCell(cell: Cell): IFigure | null {
        const boardCell = this.getBoardCell(cell);
        return boardCell !== null ? boardCell.figure : null;
    }

    hasFigureOnCell(cell: Cell): boolean {
        return this.getFigureOnCell(cell) !== null;
    }
}