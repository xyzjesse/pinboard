"use client";

import { useNodes, useNodesActions } from "@/stores/use-nodes-store";
import { ImageNode } from "./nodes/image-node";
import { MDNode } from "./nodes/md-node";
import { Background } from "./pinboard/background";
import { PinBoard } from "./pinboard/pinboard";
import { ToolBar } from "./toolbar";

export const nodeTypes = {
	mdx: MDNode,
	image: ImageNode,
};

export function App() {
	const nodes = useNodes();
	const { setNodes } = useNodesActions();

	return (
		<PinBoard nodes={nodes} onNodesChange={setNodes} nodeTypes={nodeTypes}>
			<ToolBar />
			<Background />
		</PinBoard>
	);
}
