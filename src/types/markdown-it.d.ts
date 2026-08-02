declare module "markdown-it" {
	interface Token {
		type: string;
		content: string;
		children: Token[] | null;
	}

	class MarkdownIt {
		constructor(options?: Record<string, unknown>);
		parse(src: string, env: Record<string, unknown>): Token[];
		render(src: string): string;
		renderInline(src: string): string;
	}

	export default MarkdownIt;
}
