export class MinHeap<T> {
	private heap: T[] = [];

	constructor(private compareFn: (a: T, b: T) => number) {}

	get size(): number {
		return this.heap.length;
	}

	isEmpty(): boolean {
		return this.size === 0;
	}

	peek(): T | undefined {
		return this.heap[0];
	}

	push(value: T): void {
		this.bubbleUp(this.heap.push(value) - 1);
	}

	pop(): T | undefined {
		if (this.isEmpty()) return undefined;

		const min = this.heap[0];

		const last = this.heap.pop();

		// Se ainda sobrou item, põe o último no topo e reordena para baixo
		if (!this.isEmpty() && last) {
			this.heap[0] = last;
			this.bubbleDown(0);
		}

		return min;
	}

	private bubbleUp(index: number): void {
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);

			if (this.compareFn(this.heap[index], this.heap[parentIndex]) >= 0) break;

			this.swap(index, parentIndex);
			index = parentIndex;
		}
	}

	private bubbleDown(index: number): void {
		while (true) {
			let smallest = index;
			const leftChild = 2 * index + 1;
			const rightChild = 2 * index + 2;

			// Verifica se filho da esquerda é menor que o atual
			if (leftChild < this.size && this.compareFn(this.heap[leftChild], this.heap[smallest]) < 0) {
				smallest = leftChild;
			}

			// Verifica se filho da direita é menor que o atual (ou o da esquerda que acabou de ganhar)
			if (rightChild < this.size && this.compareFn(this.heap[rightChild], this.heap[smallest]) < 0) {
				smallest = rightChild;
			}

			// Se o menor continua sendo o atual, acabou.
			if (smallest === index) break;

			this.swap(index, smallest);
			index = smallest;
		}
	}

	private swap(i: number, j: number): void {
		[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
	}
}
