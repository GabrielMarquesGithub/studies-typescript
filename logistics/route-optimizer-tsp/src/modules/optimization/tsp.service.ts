import type {
	IGraphEdge,
	IOptimizeCoordinatesBody,
	IOptimizeNetworkBody,
	IOptimizeNetworkResponse,
	IPoint,
	IRoadCondition
} from "@modules/optimization/optimize.schemas";
import { MinHeap } from "src/libs/min-heap";

type IGraph = Map<string, { node: string; cost: number }[]>;

export class TSPService {
	optimizeCoordinates(input: IOptimizeCoordinatesBody): IPoint[] {
		const { start, end, stops } = input;

		const route: IPoint[] = [start];
		const unvisited = new Set(stops);

		let current = start;

		while (unvisited.size > 0) {
			let nearest: IPoint | null = null;
			let minDist = Infinity;

			for (const candidate of unvisited) {
				const dist = this.calculateCoordinatesDistance(current, candidate);

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

	private calculateCoordinatesDistance(p1: IPoint, p2: IPoint): number {
		const dx = p1.x - p2.x;
		const dy = p1.y - p2.y;
		// Usando distância ao quadrado para evitar raiz quadrada desnecessária
		return dx * dx + dy * dy;
	}

	optimizeNetwork(input: IOptimizeNetworkBody): IOptimizeNetworkResponse {
		const { startNodeId, endNodeId, stopsNodeIds, edges } = input;

		const graph = this.buildGraph(edges);

		this.validateTopology(graph, startNodeId, endNodeId, stopsNodeIds);

		const route: string[] = [startNodeId];
		const unvisited = new Set(stopsNodeIds);
		unvisited.delete(startNodeId); // Sanitização

		let currentNode = startNodeId;
		let totalCost = 0;

		while (unvisited.size > 0) {
			let nearestNode: string | null = null;
			let minCost = Infinity;

			const distancesFromCurrent = this.dijkstraOneToMany(graph, currentNode);

			for (const candidateNode of unvisited) {
				const cost = distancesFromCurrent[candidateNode];

				if (cost === undefined) continue;

				if (cost < minCost) {
					minCost = cost;
					nearestNode = candidateNode;
				}
			}

			if (!nearestNode) {
				throw new Error(
					`Rota travada: Impossível sair de '${currentNode}' para alcançar as paradas restantes (Grafo desconexo).`
				);
			}

			route.push(nearestNode);
			totalCost += minCost;
			unvisited.delete(nearestNode);
			currentNode = nearestNode;
		}

		// Verificação final para o destino
		const distanceToEnd = this.findShortestPathCost(graph, currentNode, endNodeId);

		if (distanceToEnd === Infinity) {
			throw new Error(`Rota incompleta: Não há caminho de '${currentNode}' para o destino '${endNodeId}'.`);
		}

		route.push(endNodeId);
		totalCost += distanceToEnd;

		return {
			route,
			distance: totalCost
		};
	}

	private validateTopology(graph: IGraph, start: string, end: string, stops: string[]): void {
		// Falha rápida para nós desconectados
		if (!graph.has(start)) throw new Error(`Inicio '${start}' desconectado.`);
		if (!graph.has(end)) throw new Error(`Destino '${end}' desconectado.`);

		for (const stop of stops) {
			if (!graph.has(stop)) throw new Error(`Parada '${stop}' desconectada da rede.`);

			// Parada intermediária não pode ser beco sem saída
			const exits = graph.get(stop);
			if (!exits || exits.length === 0) {
				throw new Error(`Rota impossível: A parada '${stop}' é um beco sem saída.`);
			}
		}
	}

	private buildGraph(edges: IGraphEdge[]): IGraph {
		const graph = new Map();

		edges.forEach((edge) => {
			const cost = edge.distance * this.getConditionFactor(edge.roadCondition);

			// Adiciona ida
			if (!graph.has(edge.from)) graph.set(edge.from, []);
			graph.get(edge.from).push({ node: edge.to, cost });

			// Garante que o nó de destino também existe no grafo
			if (!graph.has(edge.to)) graph.set(edge.to, []);
		});

		return graph;
	}

	private getConditionFactor(condition: IRoadCondition): number {
		switch (condition) {
			case "GOOD":
				return 1.0;
			case "REGULAR":
				return 1.3; // 30% mais lento/custoso
			case "BAD":
				return 2.0; // Dobro do custo
		}
	}

	private dijkstraOneToMany(graph: IGraph, start: string): Record<string, number> {
		const costs: Record<string, number> = {};

		// Implementação com Min-Heap para otimizar a seleção do próximo nó
		const pq = new MinHeap<{ node: string; cost: number }>((a, b) => a.cost - b.cost);

		// Adiciona o ponto de partida
		pq.push({ node: start, cost: 0 });
		costs[start] = 0;

		while (!pq.isEmpty()) {
			const current = pq.pop();

			if (!current) continue;
			const { node, cost } = current;

			if (typeof costs[node] === "number" && cost > costs[node]) continue;

			const neighbors = graph.get(node);
			if (!neighbors) continue;

			for (const neighbor of neighbors) {
				const newCost = cost + neighbor.cost;

				if (costs[neighbor.node] === undefined || newCost < costs[neighbor.node]) {
					costs[neighbor.node] = newCost;
					pq.push({ node: neighbor.node, cost: newCost });
				}
			}
		}

		return costs;
	}

	private findShortestPathCost(graph: IGraph, start: string, end: string): number {
		if (start === end) return 0;

		const allDistances = this.dijkstraOneToMany(graph, start);
		return allDistances[end] ?? Infinity;
	}
}
