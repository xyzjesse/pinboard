import { NodeProps, NodeTypes } from "@/components/pinboard/types";
import { uuid4 } from "@/lib/utils";
import { ComponentProps } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Node<T extends NodeProps<any, any> = NodeProps<string, any>> = T;

export type NodesState = {
	nodes: Array<Node>;
	selectedNodeId: string | null;
};

type NodeActions<T extends NodeTypes> = {
	setNode: <N extends NodeProps<string, any>>(
		id: string,
		node: Partial<N>
	) => void;
	setNodes: (nodes: Array<Node>) => void;
	removeNode: (id: string) => void;
	addNode: <K extends keyof T>(
		type: K,
		node?: Omit<ComponentProps<T[K]>["node"], "id" | "type">
	) => void;
	setSelectedNodeId: (id: string | null) => void;
};

type NodesStore<T extends NodeTypes = NodeTypes<NodeProps<string, {}>>> =
	NodesState & {
		actions: NodeActions<T>;
	};

const initialState: NodesState = {
	nodes: [],
	selectedNodeId: null,
};

const useNodesStore = create(
	persist<NodesStore>(
		(set) => ({
			...initialState,
			actions: {
				setNode: (id, data) =>
					set((state) => ({
						nodes: state.nodes.map((node) => {
							return node.id === id ? { ...node, ...data } : node;
						}),
					})),
				setNodes: (nodes) => set({ nodes }),
				removeNode: (id) =>
					set((state) => ({
						nodes: state.nodes.filter((node) => node.id !== id),
					})),
				addNode: (type, node) =>
					set((state) => ({
						nodes: [
							...state.nodes,
							{
								position: { x: 0, y: 0 },
								...node,
								id: uuid4(),
								type,
							} as NodeProps<typeof type, {}>,
						],
					})),
				setSelectedNodeId: (id) => set({ selectedNodeId: id }),
			},
		}),
		{
			name: "nodes",
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([key]) => !["actions"].includes(key))
				) as NodesStore,
		}
	)
);

export const useNodes = () => useNodesStore((state) => state.nodes);
export const useSelectedNodeId = () =>
	useNodesStore((state) => state.selectedNodeId);

export const useNodesActions = <
	T extends NodeTypes = NodeTypes<NodeProps<string, {}>>
>() => useNodesStore((state) => state.actions as NodeActions<T>);
