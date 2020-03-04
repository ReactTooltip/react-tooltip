const idLen = 20;
const styleId = Math.round((Math.pow(36, idLen + 1) - Math.random() * Math.pow(36, idLen))).toString(36).slice(1); // TODO: gotta make it so there are only letters, no numbers

class IdGenerator {

	static get styleId() {
		return styleId;
	}

	static generateInternalTooltipUID() {
		return Math.round((Math.pow(36, idLen + 1) - Math.random() * Math.pow(36, idLen))).toString(36).slice(1); // TODO: gotta make it so there are only letters, no numbers
	}
}

export default IdGenerator;