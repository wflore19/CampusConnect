import { type RawBuilder, sql } from 'kysely';

type Point = {
    x: number;
    y: number;
};

export function point({ x, y }: Point): RawBuilder<Point> {
    return sql<Point>`point(${x}, ${y})`;
}

export function run<T>(fn: () => T): T {
    return fn();
}
