class EventSystem {
	constructor() {
		// 任务队列
		this.queue = [];
		// 是否需要停止任务队列
		this.stop = 0;
		// 超时处理
		this.timeoutResolve = null;
	}
	// 没有任务时，事件循环的睡眠时间
	sleep(time) {
		return new Promise((resolve) => {
			let timer = null;
			// 记录resolve，可能在睡眠期间有任务到来，则需要提前唤醒
			this.timeoutResolve = () => {
				clearTimeout(timer);
				timer = null;
				this.timeoutResolve = null;
				resolve();
			};
			timer = setTimeout(() => {
				if (timer) {
		 			console.log('timeout');
					this.timeoutResolve = null;
					resolve();
				}
			}, time);
		});
	}
	// 停止事件循环
	setStop() {
		this.stop = 1;
		this.timeoutResolve && this.timeoutResolve();
	}

	// 追加任务
	enQueue(func) {
		this.queue.push(func);
		this.timeoutResolve && this.timeoutResolve();
	}

	// 事件循环
	async run() {
		while(1 && this.stop === 0) {
			while(this.queue.length) {
		 		const func = this.queue.shift();
		 		func();
		 	}
		 	// 没有任务了，一直等待（Math.pow(2, 31) - 1为nodejs中定时器的最大值）
		 	await this.sleep(Math.pow(2, 31) - 1);
		}
	}
}
// 新建一个事件循环系统
const eventSystem = new EventSystem();
// 生产任务
eventSystem.enQueue(() => {
	console.log('hi');
});
// 模拟定时生成一个任务
setTimeout(() => {
	eventSystem.enQueue(() => {
		console.log('hello');
	});
}, 1000);
// 模拟退出事件循环
setTimeout(() => {
	eventSystem.setStop();
}, 2000);
// 启动事件循环
eventSystem.run();
