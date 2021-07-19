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
    keys = {};

    // 학습할 데이터를 각각의 배열에 담기
    init = (stocks, completed, ing, keys) => {
        this.keys = keys;
        this.stocks = stocks;

        this.x1s = this.stocks.map(value => parseInt(value[this.keys.x1].replace(/,/g , '')));
        this.x2s = this.stocks.map(value => parseInt(value[this.keys.x2].replace(/,/g , '')));
        this.x3s = this.stocks.map(value => parseInt(value[this.keys.x3].replace(/,/g , '')));
        this.ys = this.stocks.map(value => parseInt(value[this.keys.y].replace(/,/g , '')));

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

        const mx1 = xs1.mul(this.m1);
        const mx2 = xs2.mul(this.m2);
        const mx3 = xs3.mul(this.m3);

        const ys = mx1.add(mx2).add(mx3).add(this.b);

        return ys;
    }

    loss = (pred, labels) => pred.sub(labels).square().mean();

    start = (completed, ing) => {
        tf.tidy(() => {
            for(let i = 0; i < 10; i++) {
                this.optimizer.minimize(() => this.loss(this.predict(this.x1s, this.x2s, this.x3s), tf.tensor(this.ys)));
            }
        });
        this.restart(completed, ing);
    }

    restart(completed, ing) {
        // 학습데이터의 예측값
        let predict_y = Number(String(this.predict(parseFloat(this.x1s[0]),parseFloat(this.x2s[0]),parseFloat(this.x3s[0]))).replace('Tensor','').replace(/a/gi,""));
        // 예측값 - 실제 값
        let gap = Math.abs(predict_y - this.ys[0]);
        // 예측해야 될 데이터
        let x1 = parseFloat(this.stocks[1][this.keys.x1].replace(/,/g, ''));
        let x2 = parseFloat(this.stocks[1][this.keys.x2].replace(/,/g, ''));
        let x3 = parseFloat(this.stocks[1][this.keys.x3].replace(/,/g, ''));
        // 아직 최소 갭이 아니라면
        let if1 = this.mingap > gap;
        // 너무 빨리 끝났다면
        let if2 = this.compute < 5;

        if(if1) {
            let gap2 = Math.abs(this.mingap - gap);
            let t = 1;
                 if(gap > 1000) { t = 1.4; }
            else if(gap > 100) { t = 1.3; }
            else if(gap > 10) { t = 1.2; }
            else if(gap > 1) { t = 1.1; }
            else if(gap > 0.1) { t = 1; }

            this.mingap = this.mingap < gap ? this.mingap : gap;
            this.learnignRate = this.learnignRate * t;
            this.optimizer = tf.train.sgd(this.learnignRate);
            this.compute = this.compute+1;

            ing(this.y);

            this.y = Number(String(this.predict(x1,x2,x3)).replace('Tensor','').replace(/a/gi,""));

            setTimeout(() => this.start(completed, ing), 1);
        } else if (if2) {

            this.learnignRate = this.learnignRate * 10;
            this.optimizer = tf.train.sgd(this.learnignRate * 10);
            this.m1 = tf.variable(tf.scalar(Math.random(1)));
            this.m2 = tf.variable(tf.scalar(Math.random(1)));
            this.m3 = tf.variable(tf.scalar(Math.random(1)));
            this.b = tf.variable(tf.scalar(Math.random(1)));
            this.mingap = 99999999999;
            this.compute = 0;

            setTimeout(() => this.start(completed, ing), 1);
        } else {
            completed(this.m1, this.m2, this.m3, this.b);
        }
    }
}