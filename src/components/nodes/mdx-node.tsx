import { cn } from "@/lib/utils";
import { useNodes, useNodesActions } from "@/stores/use-nodes-store";
import {
	FormEvent,
	memo,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { CustomNodeProps, NodeProps } from "../pinboard/types";
import { BaseNode } from "./base-node";

export type MDXNodeProps = NodeProps & {
	type: "mdx";
	data: {
		label: string;
	};
};

export function MDXNodee({ node, handleRef }: CustomNodeProps<MDXNodeProps>) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const nodes = useNodes();
	const { setNode } = useNodesActions();

	const [editing, setEditing] = useState(false);

	useImperativeHandle(
		handleRef,
		() => {
			return {
				onDoubleClick: () => {
					textareaRef.current?.focus();
					setEditing(true);
				},
			};
		},
		[]
	);

	function autoResize() {
		if (!textareaRef.current) {
			return;
		}

		textareaRef.current.style.height = "auto";
		textareaRef.current.style.height =
			textareaRef.current.scrollHeight + 2 + "px"; // 2px to account for padding
	}

	function handleInput(_: FormEvent<HTMLTextAreaElement>) {
		autoResize();

		if (!nodes || !textareaRef.current) {
			return;
		}

		setNode<MDXNodeProps>(node.id, {
			data: { label: textareaRef.current.value },
		});
	}

	function handleBlur() {
		setEditing(false);

		if (window.getSelection()?.focusNode?.contains(textareaRef.current)) {
			window.getSelection()?.empty();
		}
	}

	useEffect(() => {
		autoResize();
	}, []);

	return (
		<BaseNode className="p-2 min-h-[250px] w-[250px] text-sm">
			<textarea
				ref={textareaRef}
				autoComplete="off"
				autoCapitalize="off"
				autoCorrect="off"
				readOnly={!editing}
				spellCheck={editing}
				className={cn(
					"outline-none resize-none bg-transparent overflow-hidden w-full",
					{
						"pointer-events-auto": editing,
					}
				)}
				cols={25}
				defaultValue={node.data.label ?? ""}
				placeholder="Type anything..."
				onInput={handleInput}
				onBlur={handleBlur}
			/>
		</BaseNode>
	);
}

export const MDXNode = memo(MDXNodee);
