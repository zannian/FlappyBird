(function () {
    window.onload = function () {
        game.init()
    }

    let game = window.game = {
        width: 0,
        height: 0,
        scale: 0,
        asset: null,
        // 定义 init 方法
        init: function () {
            this.asset = new game.Asset();
            this.asset.on('complete', function (e) {
                this.asset.off('complete');
                this.initStage();
            }.bind(this));

            this.asset.load();
        },

        // 定义初始化舞台方法
        initStage: function () {
            this.width = 720;
            this.height = 1280;
            this.scale = 0.5;

            if (innerWidth > innerHeight) {
                this.stageScaleX = innerHeight / this.height;
            } else {
                this.stageScaleX = innerWidth / this.width;
            }

            let stage = this.stage = new Hilo.Stage({
                container: document.body,
                width: this.width,
                height: this.height,
                scaleX: this.stageScaleX,
                scaleY: this.stageScaleX
            });

            //设定舞台刷新频率为60fps
            this.ticker = new Hilo.Ticker(60);
            //把舞台加入到tick队列
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);

            //启动ticker
            this.ticker.start(true);
            this.stage.onUpdate = this.onUpdate.bind(this);

            this.initBackground();
            this.initReadyScene();
            this.initBird()
            this.initHoldbacks();
            this.initCurrentScore();
            this.initOverScene();
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
            document.addEventListener('keydown', function (e) {
                if (e.keyCode === 32) this.onUserInput(e);
            }.bind(this));
            this.gameReady();
        },

        initBackground: function () {
            var bgWidth = this.width * this.stageScaleX;
            var bgHeight = this.height * this.stageScaleX;
            var groundOffset = 60;
            document.body.insertBefore(Hilo.createElement('div', {
                id: 'bg',
                style: {
                    position: 'absolute',
                    background: 'url(images/bg.png) no-repeat',
                    backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
                    width: bgWidth + 'px',
                    height: bgHeight + 'px'
                }
            }), this.stage.canvas);

            let groundImg = this.asset.ground
            this.ground = new Hilo.Bitmap({
                id: 'ground',
                image: groundImg,
                scaleX: (this.width + groundOffset * 2) / groundImg.width
            }).addTo(this.stage);

            //放置地面在舞台的最底部
            this.ground.y = this.height - this.ground.height;

            //循环移动地面
            Hilo.Tween.to(this.ground, {
                x: -groundOffset * this.ground.scaleX
            }, {
                duration: 400,
                loop: true
            });
        },

        initReadyScene: function () {
            this.readyScene = new game.ReadyScene({
                width: this.width,
                height: this.height,
                image: this.asset.ready
            }).addTo(this.stage);
        },

        initOverScene: function () {
            this.gameOverScene = new game.OverScene({
                width: this.width,
                height: this.height,
                image: this.asset.over,
                numberGlyphs: this.asset.numberGlyphs,
                visible: false
            }).addTo(this.stage);

            this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function (e) {
                //阻止舞台stage响应后续事件
                e.stopImmediatePropagation();
                this.gameOverScene.visible = false;
                this.gameReady();
            }.bind(this));
        },

        initBird: function () {
            this.bird = new game.Bird({
                id: 'bird',
                atlas: this.asset.birdAtlas,
                startX: 100,
                startY: this.height >> 1,
                groundY: this.ground.y - 12
            }).addTo(this.stage)

            // this.bird.getReady()
        },

        initCurrentScore: function () {
            //当前分数
            this.currentScore = new Hilo.BitmapText({
                id: 'score',
                glyphs: this.asset.numberGlyphs,
                textAlign: 'center'
            }).addTo(this.stage);

            //设置当前分数的位置
            this.currentScore.x = this.width - this.currentScore.width >> 1;
            this.currentScore.y = 180;
        },

        initHoldbacks: function () {
            this.holdbacks = new game.Holdbacks({
                id: 'holdbacks',
                image: this.asset.holdback,
                height: this.height,
                startX: this.width + 200,
                groundY: this.ground.y
            }).addTo(this.stage, -1)
        },

        onUserInput: function (e) {
            if (this.state !== 'over') {
                //启动游戏场景
                if (this.state !== 'playing') this.gameStart();
                //控制小鸟往上飞
                this.bird.startFly();
            }
        },

        gameReady: function () {
            this.gameOverScene.hide()
            this.state = 'ready';
            //重置分数为0
            this.score = 0;
            this.currentScore.visible = true;
            this.currentScore.setText(this.score);
            //显示准备场景
            this.readyScene.visible = true;
            //重置障碍的位置
            this.holdbacks.reset();
            //准备小鸟
            this.bird.getReady();
        },

        gameStart: function () {
            this.state = 'playing';
            //隐藏准备场景
            this.readyScene.visible = false;
            //开始从右至左移动障碍
            this.holdbacks.startMove();
        },

        onUpdate: function () {
            if (this.state === 'ready') return;

            if (this.bird.isDead) {
                //如果小鸟死亡，则游戏结束
                this.gameOver();
            } else {
                //更新玩家得分
                this.currentScore.setText(this.calcScore());
                //碰撞检测
                if (this.holdbacks.checkCollision(this.bird)) {
                    this.gameOver();
                }
            }
        },

        gameOver: function () {
            if (this.state !== 'over') {
                //设置当前状态为结束over
                this.state = 'over';
                //停止障碍的移动
                this.holdbacks.stopMove();
                //小鸟跳转到第一帧并暂停，即停止扇动翅膀
                this.bird.goto(0, true);
                //隐藏屏幕中间显示的分数
                this.currentScore.visible = false;
                //显示结束场景
                this.gameOverScene.show(this.calcScore(), this.saveBestScore());
            }
        },

        calcScore: function () {
            var count = this.holdbacks.calcPassThrough(this.bird.x);
            return this.score = count;
        },

        saveBestScore: function () {
            var score = this.score,
                best = 0;
            if (Hilo.browser.supportStorage) {
                best = parseInt(localStorage.getItem('flappy-best-score')) || 0;
            }
            if (score > best) {
                best = score;
                localStorage.setItem('flappy-best-score', score);
            }
            return best;
        }
    }

})()
