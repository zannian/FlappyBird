(function (g) {

   let Holdbacks = g.Holdbacks = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            Holdbacks.superclass.constructor.call(this, properties);
            // this.init(properties);

            //管子之间的水平间隔
            this.hoseSpacingX = 300;
            //管子上下两部分之间的垂直间隔，即小鸟要穿越的空间大小
            this.hoseSpacingY = 340;
            //管子的总数（一根管子分上下两部分）
            this.numHoses = 4;
            //预设移出屏幕左侧的管子数量，一般设置为管子总数的一半
            this.numOffscreenHoses = this.numHoses * 0.5;
            //管子的宽度（包括管子之间的间隔）
            this.hoseWidth = 148 + this.hoseSpacingX;

            //初始化障碍的宽和高
            this.width = this.hoseWidth * this.numHoses;
            this.height = properties.height;
            this.reset();
            this.createHoses(properties.image);
            this.moveTween = new Hilo.Tween(this, null, {
                onComplete: this.resetHoses.bind(this)
            });
        },

        startX: 0, //障碍开始的起始x轴坐标
        groundY: 0, //地面的y轴坐标
    
        hoseSpacingX: 0, //管子之间的水平间隔
        hoseSpacingY: 0, //上下管子之间的垂直间隔
        numHoses: 0, //管子的总数（上下一对管子算一个）
        numOffscreenHoses: 0, //移出屏幕左侧的管子数量
        hoseWidth: 0, //管子的宽度（包括管子之间的间隔）
    
        passThrough: 0, //穿过的管子的数量，也即移出屏幕左侧的管子的数量

        createHoses: function(image){
            for(var i = 0; i < this.numHoses; i++){
                //下部分管子
                var downHose = new Hilo.Bitmap({
                    image: image,
                    rect: [0, 0, 148, 820]
                }).addTo(this);
        
                //上部分管子
                var upHose = new Hilo.Bitmap({
                    image: image,
                    rect: [148, 0, 148, 820]
                }).addTo(this);
        
                this.placeHose(downHose, upHose, i);

            }
        },

        placeHose: function(down, up, index){
            //y轴最大值
            var downMaxY = this.groundY - 180;
            //y轴最小值
            var downMinY = this.groundY - down.height + this.hoseSpacingY;
            //随机位置
            down.y = downMinY + (downMaxY - downMinY) * Math.random() >> 0;
            down.x = this.hoseWidth * index;
        
            //上部分管子位置
            up.y = down.y - this.hoseSpacingY - up.height;
            up.x = down.x;
        },

        resetHoses: function(){
            console.log('出去了');
            
            var total = this.children.length;
        
            //把已移出屏幕外的管子放到队列最后面，并重置它们的可穿越位置
            for(var i = 0; i < this.numOffscreenHoses; i++){
                var downHose = this.getChildAt(0);
                var upHose = this.getChildAt(1);
                this.setChildIndex(downHose, total - 1);
                this.setChildIndex(upHose, total - 1);
                this.placeHose(downHose, upHose, this.numOffscreenHoses + i);
            }
        
            //重新确定队列中所有管子的x轴坐标
            for(var i = 0; i < total - this.numOffscreenHoses * 2; i++){
                var hose = this.getChildAt(i);
                hose.x = this.hoseWidth * (i * 0.5 >> 0);
            }
        
            //重新确定障碍的x轴坐标
            this.x = 0;
        
            //更新穿过的管子数量
            this.passThrough += this.numOffscreenHoses;
        
            //继续移动
            this.startMove();

            Hilo.Tween._tweens.push(this.moveTween);
        },

        startMove: function(){
            console.log('====================================');
            console.log('startmove');
            console.log('====================================');
            //设置缓动的x轴坐标
            var targetX = -this.hoseWidth * this.numOffscreenHoses;
            //设置缓动时间
            this.moveTween.duration = (this.x - targetX) * 4;
            //设置缓动的变换属性，即x从当前坐标变换到targetX
            this.moveTween.setProps({x:this.x}, {x:targetX});
            //启动缓动变换
            this.moveTween.start();
        },

        stopMove: function(){
            if(this.moveTween) this.moveTween.pause();
        },
    
        checkCollision: function(bird){
            for(var i = 0, len = this.children.length; i < len; i++){
                if(bird.hitTestObject(this.children[i], true)){
                    console.log('====================================');
                    console.log('碰到了');
                    console.log('====================================');
                    return true;
                }
            }
            return false;
        },

        calcPassThrough: function (x) {
            var count = 0;

            x = -this.x + x;
            if (x > 0) {
                var num = x / this.hoseWidth + 0.5 >> 0;
                count += num;
            }
            count += this.passThrough;

            return count;
        },

        reset: function(){
            this.x = this.startX;
            this.passThrough = 0;
        }
    })

})(window.game)