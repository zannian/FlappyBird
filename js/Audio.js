(function (g) {
    g.Audio =new Hilo.HTMLAudio({
        src: 'audio/dancing-under-the-stars-background-music-for-video-hip-hop-version-225245.mp3',
        autoPlay:true,
        loop:true,
        volume:0.3
    })

    g.Click =new Hilo.HTMLAudio({
        src: 'audio/preview.mp3',
        autoPlay:false,
        loop:false,
        volume:1
    })
})(window.game)