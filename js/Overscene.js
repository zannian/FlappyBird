(function (g) {
    var OverScene = g.OverScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            OverScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },

        init: function (properties) {
            //Game Over图片文字
            var gameover = this.gameover = new Hilo.Bitmap({
                id: 'gameover',
                image: properties.image,
                rect: [0, 298, 508, 158]
            });

            //结束面板
            var board = this.board = new Hilo.Bitmap({
                id: 'board',
                image: properties.image,
                rect: [0, 0, 590, 298]
            });

            //开始按钮
            var startBtn = this.startBtn = new Hilo.Bitmap({
                id: 'start',
                image: properties.image,
                rect: [590, 0, 290, 176]
            });

            //等级按钮
            var gradeBtn = this.gradeBtn = new Hilo.Bitmap({
                id: 'grade',
                image: properties.image,
                rect: [590, 176, 290, 176]
            });

            //玩家当前分数
            var scoreLabel = this.scoreLabel = new Hilo.BitmapText({
                id: 'score',
                glyphs: properties.numberGlyphs,
                scaleX: 0.5,
                scaleY: 0.5,
                letterSpacing: 4,
                text: 0
            });

            //玩家最好成绩
            var bestLabel = this.bestLabel = new Hilo.BitmapText({
                id: 'best',
                glyphs: properties.numberGlyphs,
                scaleX: 0.5,
                scaleY: 0.5,
                letterSpacing: 4,
                text: 0
            });

            //白色的遮罩效果
            var whiteMask = this.whiteMask = new Hilo.View({
                id: 'mask',
                width: this.width,
                height: this.height,
                alpha: 0,
                background: '#fff'
            })

            //设置各个元素的坐标位置
            board.x = this.width - board.width >> 1;
            board.y = this.height - board.height >> 1;
            gameover.x = this.width - gameover.width >> 1;
            gameover.y = board.y - gameover.height - 20;
            startBtn.x = board.x - 5;
            startBtn.y = board.y + board.height + 20 >> 0;
            gradeBtn.x = startBtn.x + startBtn.width + 20 >> 0;
            gradeBtn.y = startBtn.y;
            scoreLabel.x = board.x + board.width - 140 >> 0;
            scoreLabel.y = board.y + 90;
            bestLabel.x = scoreLabel.x;
            bestLabel.y = scoreLabel.y + 105;

            this.addChild(gameover, board, startBtn, gradeBtn, scoreLabel, bestLabel, whiteMask);
        },

        show: function (score, bestScore) {
            this.visible = true;
            this.getChildById('score').setText(score);
            this.getChildById('best').setText(bestScore);
            this.getChildById('mask').alpha = 1;

            Hilo.Tween.to(this.getChildById('gameover'), {alpha:1}, {duration:100});
            Hilo.Tween.to(this.getChildById('board'), {alpha:1, y:this.getChildById('board').y-150}, {duration:200, delay:200});
            Hilo.Tween.to(this.getChildById('score'), {alpha:1, y:this.getChildById('score').y-150}, {duration:200, delay:200});
            Hilo.Tween.to(this.getChildById('best'), {alpha:1, y:this.getChildById('best').y-150}, {duration:200, delay:200});
            Hilo.Tween.to(this.getChildById('start'), {alpha:1}, {duration:100, delay:600});
            Hilo.Tween.to(this.getChildById('grade'), {alpha:1}, {duration:100, delay:600});
            Hilo.Tween.to(this.getChildById('mask'), {alpha:0}, {duration:400});
        },

        hide : function(){
            this.visible = false;
            this.getChildById('gameover').alpha = 0;
            this.getChildById('board').alpha = 0;
            this.getChildById('score').alpha = 0;
            this.getChildById('best').alpha = 0;
            this.getChildById('start').alpha = 0;
            this.getChildById('grade').alpha = 0;
            this.getChildById('board').y += 150;
            this.getChildById('score').y += 150;
            this.getChildById('best').y += 150;
        }
    });

})(window.game)