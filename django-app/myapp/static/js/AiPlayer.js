console.log("Worker AI loaded");

addEventListener("message", event => {
	console.log("received message", event.data);
	playGameAI();
})

addEventListener("error", error => {
    console.error("Worker error:", error.message);
});

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function playGameAI() {

	console.log("starting loop AI");

	var last_state = 0; // 1 = up , 0 = idle, -1 = down

	while (true) {

		await sleep(300);

		if (last_state == 1 && Math.random() < 0.2) {
			postMessage("stopGoUp");
			last_state = 0;
		}
		else if (last_state == -1 && Math.random() < 0.2) {
			postMessage("stopGoDown");
			last_state = 0;
		}
		else if (last_state == 0 && Math.random() < 0.4) {
			if (Math.random() > 0.5) {
				postMessage("goUp");
				last_state = 1;
			} else {
				postMessage("goDown");
				last_state = -1;
			}
		}
	}
}
