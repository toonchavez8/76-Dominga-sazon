const phoneHrefCodePoints = [
	116, 101, 108, 58, 43, 53, 50, 49, 51, 51, 50, 50, 54, 50, 54, 53, 53, 48,
];
const whatsappBaseCodePoints = [
	104, 116, 116, 112, 115, 58, 47, 47, 119, 97, 46, 109, 101, 47,
];
const whatsappNumberCodePoints = [
	53, 50, 51, 51, 50, 50, 54, 50, 54, 53, 53, 48,
];
const whatsappMessageCodePoints = [
	72, 111, 108, 97, 44, 32, 81, 117, 105, 115, 105, 101, 114, 97, 32, 104, 97,
	99, 101, 114, 32, 117, 110, 32, 112, 101, 100, 105, 100, 111, 33,
];

function decodeCodePoints(codePoints: number[]) {
	return String.fromCharCode(...codePoints);
}

export function getPhoneHref() {
	return decodeCodePoints(phoneHrefCodePoints);
}

export function getWhatsAppHref() {
	const base = decodeCodePoints(whatsappBaseCodePoints);
	const number = decodeCodePoints(whatsappNumberCodePoints);
	const message = decodeCodePoints(whatsappMessageCodePoints);

	return `${base}${number}?text=${encodeURIComponent(message)}`;
}
