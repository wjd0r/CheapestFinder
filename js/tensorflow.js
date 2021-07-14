class Tensorflow {
    stocks = [];
    yesterStocks = [];
    learnignRate = 0.0000000000000001;
    optimizer = tf.train.sgd(0.0000000000000001);
    m1 = tf.variable(tf.scalar(Math.random(1)));
    m2 = tf.variable(tf.scalar(Math.random(1)));
    m3 = tf.variable(tf.scalar(Math.random(1)));
    b = tf.variable(tf.scalar(Math.random(1)));
    y = 0;
    y2 = 0;
    x1s = [];
    x2s = [];
    x3s = [];
    ys = [];
    run2 = 0;
    mingap = 99999999999;
    learning_magnification = 1;
    compute = 0;

    init = () => {
        x1s = stocks.map(value => parseInt(value.MMEND_CLSPRC.replace(/,/g , '')));
        x2s = stocks.map(value => parseInt(value.HGST_CLSPRC.replace(/,/g , '')));
        x3s = stocks.map(value => parseInt(value.LWST_CLSPRC.replace(/,/g , '')));
        ys = prevState.stocks.map(value => parseInt(this.state.run2 ? value.LWST_CLSPRC.replace(/,/g , '') : value.HGST_CLSPRC.replace(/,/g , '')));

        x1s.shift(); // 처음  요소 삭제
        x2s.shift(); // 처음  요소 삭제
        x3s.shift(); // 처음  요소 삭제
        ys.pop(); // 마지막 요소 삭제

        start();
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

    start = () => {
        tf.tidy(() => {
            for(let i = 0; i < 10; i++) {
                optimizer.minimize(() => loss(predict(x1s, x2s, x3s), tf.tensor(ys)));
            }
        });
        restart();
    }

    restart() {
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
        // 최고가 계산이 끝났다면
        let if3 = run2 == 0;

        if(if1) {
            let gap2 = Math.abs(mingap - gap);
            let t = 1;
                 if(gap > 1000) { t = 1.4; }
            else if(gap > 100) { t = 1.3; }
            else if(gap > 10) { t = 1.2; }
            else if(gap > 1) { t = 1.1; }
            else if(gap > 0.1) { t = 1; }

            learning_magnification = t;

            mingap = mingap < gap ? mingap : gap;
            learnignRate = learnignRate * learning_magnification;
            optimizer = tf.train.sgd(learnignRate);
            compute = compute+1;

            if(run2 == 2) {
                y2 = Number(String(predict(x1,x2,x3)).replace('Tensor','').replace(/a/gi,""));
            } else {
                y = Number(String(predict(x1,x2,x3)).replace('Tensor','').replace(/a/gi,""));
            }

            setTimeout(() => start(), 1);
        } else if (if2) {

            learnignRate = learnignRate * 10;
            optimizer = tf.train.sgd(learnignRate * 10);
            m1 = tf.variable(tf.scalar(Math.random(1)));
            m2 = tf.variable(tf.scalar(Math.random(1)));
            m3 = tf.variable(tf.scalar(Math.random(1)));
            b = tf.variable(tf.scalar(Math.random(1)));
            mingap = 99999999999;
            compute = 0;

            setTimeout(() => start(), 1);
        } else if (if3) {
            learnignRate = 0.0000000000000001;
            optimizer = tf.train.sgd(0.0000000000000001);
            m1 = tf.variable(tf.scalar(Math.random(1)));
            m2 = tf.variable(tf.scalar(Math.random(1)));
            m3 = tf.variable(tf.scalar(Math.random(1)));
            b = tf.variable(tf.scalar(Math.random(1)));
            x1s = [];
            x2s = [];
            x3s = [];
            ys = [];
            run2 = 2;
            mingap = 99999999999;
            compute = 0;

            tensorinit();
        } else {
            completed();
        }
    }


    constructor(prop) {
        this.prop = prop;
    }

    static staticMethod() {
        /*
        정적 메소드는 this를 사용할 수 없다.
        정적 메소드 내부에서 this는 클래스의 인스턴스가 아닌 클래스 자신을 가리킨다.
        */
        return 'staticMethod';
    }

    prototypeMethod() {
        return this.prop;
    }
}

// 정적 메소드는 클래스 이름으로 호출한다.
console.log(Foo.staticMethod());

const foo = new Foo(123);
// 정적 메소드는 인스턴스로 호출할 수 없다.
console.log(foo.staticMethod()); // Uncaught TypeError: foo.staticMethod is not a function