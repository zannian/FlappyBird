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

            let stage = this.stage = new Hilo.Stage({
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });

            document.body.appendChild(stage.canvas);

            console.log('舞台初始化');


            //设定舞台刷新频率为60fps
            this.ticker = new Hilo.Ticker(60);
            //把舞台加入到tick队列
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);

            //启动ticker
            this.ticker.start(true);


            this.initBackground();
            this.initReadyScene();

        },

        initBackground: function () {
            var bgWidth = this.width * this.scale;
            var bgHeight = this.height * this.scale;
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
            console.log('素材放入舞台');
            console.log(this.asset.ready);

            this.readyScene = new game.ReadyScene({
                width: this.width,
                height: this.height,
                image: this.asset.ready
            }).addTo(this.stage);
        }
    }

})()
