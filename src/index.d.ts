import {SKRSContext2D } from "@napi-rs/canvas";

declare module "util-canvas" {
	export interface DrawOptions {
		maxWidth?: number;
		emojiSideMarginPercent?: number;
		emojiTopMarginPercent?: number;
	}
	
	export function fillTextWithTwemoji(
		context: SKRSContext2D,
		text: string,
		x: number,
		y: number,
		options?: DrawOptions
	): Promise<void>;
	
	export function strokeTextWithTwemoji(
		context: SKRSContext2D,
		text: string,
		x: number,
		y: number,
		options?: DrawOptions
	): Promise<void>;
	
	export function measureText(
		context: SKRSContext2D,
		text: string,
		options?: { emojiSideMarginPercent?: number; }
	): { width: number; alphabeticBaseline: number; };
}
