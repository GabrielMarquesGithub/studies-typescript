import type { IPoint } from "@modules/optimization/optimize.schemas";

export class TSPService {
	optimizeRoute(start: IPoint, end: IPoint, stops: IPoint[]): IPoint[] {
		const route: IPoint[] = [start];
		const unvisited = new Set(stops);

		let current = start;

		while (unvisited.size > 0) {
			let nearest: IPoint | null = null;
			let minDist = Infinity;

			for (const candidate of unvisited) {
				const dist = this.calculateDistance(current, candidate);

				if (dist < minDist) {
					minDist = dist;
					nearest = candidate;
				}
			}

			if (nearest) {
				route.push(nearest);
				unvisited.delete(nearest);
				current = nearest;
			}
		}

		route.push(end);

		return route;
	}

	private calculateDistance(p1: IPoint, p2: IPoint): number {
		const dx = p1.x - p2.x;
		const dy = p1.y - p2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
}
