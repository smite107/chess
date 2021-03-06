import { FigureType, IFigure, MovesList, PlayerColor } from '../../types';
import { Figure, FigureProps } from './Figure';

export class Pawn extends Figure implements IFigure {
    constructor(props: Omit<FigureProps, 'type'>) {
        super({
            ...props,
            type: FigureType.Pawn,
        });
    }

    getPossibleMoves(): MovesList {
        const result: MovesList = {
            cellsToMove: [],
            cellsToAttack: [],
        };
        const { col, row } = this.cell;
        const direction = this.color === PlayerColor.Black ? 1 : -1;

        for (let i = col - 1; i <= col + 1; i += 2) {
            const cell = { col: i, row: row + direction };
            if (this.board.checkCellExisting(cell)) {
                const figure = this.board.getFigureOnCell(cell);
                if (figure !== null && this.isEnemyFigure(figure)) {
                    result.cellsToAttack.push(cell);
                }
            }
        }

        const closestCell = {row: row + direction, col};
        if (this.board.checkCellExisting(closestCell) && this.board.hasFigureOnCell(closestCell)) {
            return result;
        }
        result.cellsToMove.push(closestCell);

        if (this.isOnStartPosition) {
            const nextCell = { row: closestCell.row + direction, col: closestCell.col };
            if (!this.board.hasFigureOnCell(nextCell)) {
                result.cellsToMove.push(nextCell);
            }
        }

        return result;
    }
}