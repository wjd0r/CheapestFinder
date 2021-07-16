class MyTensorflow {
    stocks = [];
    learnignRate = 0.0000000000000001;
    optimizer = tf.train.sgd(0.0000000000000001);
    m1 = tf.variable(tf.scalar(Math.random(1)));
    m2 = tf.variable(tf.scalar(Math.random(1)));
    m3 = tf.variable(tf.scalar(Math.random(1)));
    b = tf.variable(tf.scalar(Math.random(1)));
    y = 0;
    x1s = [];
    x2s = [];
    x3s = [];
    ys = [];
    mingap = 99999999999;
    compute = 0;

    // 학습할 데이터를 각각의 배열에 담기
    init = (stocks, completed, ing) => {
        this.stocks = stocks;

        this.x1s = this.stocks.map(value => parseInt(value.MMEND_CLSPRC.replace(/,/g , '')));
        this.x2s = this.stocks.map(value => parseInt(value.HGST_CLSPRC.replace(/,/g , '')));
        this.x3s = this.stocks.map(value => parseInt(value.LWST_CLSPRC.replace(/,/g , '')));
        this.ys = this.stocks.map(value => parseInt(value.HGST_CLSPRC.replace(/,/g , '')));

        this.x1s.shift(); // 처음  요소 삭제
        this.x2s.shift(); // 처음  요소 삭제
        this.x3s.shift(); // 처음  요소 삭제
        this.ys.pop(); // 마지막 요소 삭제

        this.start(completed, ing);
    }

    predict = (x1, x2, x3) => {
        const xs1 = tf.tensor(x1);
        const xs2 = tf.tensor(x2);
        const xs3 = tf.tensor(x3);

        const mx1 = xs1.mul(this.state.m1);
        const mx2 = xs2.mul(this.state.m2);
        const mx3 = xs3.mul(this.state.m3);

        const ys = mx1.add(mx2).add(mx3).add(this.state.b);

        return ys;
    }

    loss = (pred, labels) => pred.sub(labels).square().mean();

    start = (completed, ing) => {
        tf.tidy(() => {
            for(let i = 0; i < 10; i++) {
                optimizer.minimize(() => loss(predict(x1s, x2s, x3s), tf.tensor(ys)));
            }
        });
        this.restart(completed, ing);
    }

    restart(completed, ing) {
        // 학습데이터의 예측값
        let predict_y = Number(String(predict(parseFloat(x1s[0]),parseFloat(x2s[0]),parseFloat(x3s[0]))).replace('Tensor','').replace(/a/gi,""));
        // 예측값 - 실제 값
        let gap = Math.abs(predict_y - ys[0]);
        // 예측해야 될 데이터
        let x1 = parseFloat(stocks[1].MMEND_CLSPRC.replace(/,/g, ''));
        let x2 = parseFloat(stocks[1].HGST_CLSPRC.replace(/,/g, ''));
        let x3 = parseFloat(stocks[1].LWST_CLSPRC.replace(/,/g, ''));
        // 아직 최소 갭이 아니라면
        let if1 = mingap > gap;
        // 너무 빨리 끝났다면
        let if2 = compute < 5;

        if(if1) {
            let gap2 = Math.abs(mingap - gap);
            let t = 1;
                 if(gap > 1000) { t = 1.4; }
            else if(gap > 100) { t = 1.3; }
            else if(gap > 10) { t = 1.2; }
            else if(gap > 1) { t = 1.1; }
            else if(gap > 0.1) { t = 1; }

            this.mingap = mingap < gap ? mingap : gap;
            this.learnignRate = learnignRate * t;
            this.optimizer = tf.train.sgd(learnignRate);
            this.compute = compute+1;

            ing(y);

            this.y = Number(String(predict(x1,x2,x3)).replace('Tensor','').replace(/a/gi,""));

            setTimeout(() => start(), 1);
        } else if (if2) {

            this.learnignRate = learnignRate * 10;
            this.optimizer = tf.train.sgd(learnignRate * 10);
            this.m1 = tf.variable(tf.scalar(Math.random(1)));
            this.m2 = tf.variable(tf.scalar(Math.random(1)));
            this.m3 = tf.variable(tf.scalar(Math.random(1)));
            this.b = tf.variable(tf.scalar(Math.random(1)));
            this.mingap = 99999999999;
            this.compute = 0;

            setTimeout(() => start(), 1);
        } else {
            completed(m1, m2, m3, b);
        }
    }
}