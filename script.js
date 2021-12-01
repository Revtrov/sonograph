window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    const owl = document.getElementById("owl");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    class Bar {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput) {
            const sound = micInput * 50000;
            if (sound > this.height) {
                this.height = sound;
            } else {
                this.height -= this.height * 0.03;
            }
        }
        draw(ctx, volume) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.save();
            ctx.beginPath();
            ctx.translate(canvas.width / 2.075, canvas.height / 6.0);
            ctx.rotate(this.index * 0.0003);
            ctx.bezierCurveTo(this.x / 8, this.y / 4, this.height / 2, this.height / -2, this.x / 2, -this.y / 32)
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.translate(canvas.width / 1.925, canvas.height / 6.0);
            ctx.rotate(this.index * 0.0003);
            ctx.bezierCurveTo(-(this.x / 8), this.y / 4, -(this.height / 2), (this.height / -2), -this.x / 2, -this.y / 32)
            ctx.stroke()
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(this.index * 0.1);
            ctx.bezierCurveTo(this.x / -0.5, this.y / -0.5, this.height, this.height, this.x, this.y)
            ctx.stroke()
            ctx.restore();

        }
    }
    class Microphone {
        constructor(fftSize) {
            this.initialized = false;
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    this.audioContext = new AudioContext();
                    this.microphone = this.audioContext.createMediaStreamSource(stream);
                    this.analyser = this.audioContext.createAnalyser();
                    this.analyser.fftSize = fftSize;
                    const bufferLength = this.analyser.frequencyBinCount;
                    this.dataArray = new Uint8Array(bufferLength);
                    this.microphone.connect(this.analyser);
                    this.initialized = true;
                }).catch((err) => {
                    alert(err)
                });
        }
        getSamples() {
            this.analyser.getByteTimeDomainData(this.dataArray);
            let normSamples = [...this.dataArray].map(e => e / 128 - 1);
            return normSamples;

        }
        getVolume() {
            this.analyser.getByteTimeDomainData(this.dataArray);
            let normSamples = [...this.dataArray].map(e => e / 128 - 1);
            let sum = 0;
            for (let i = 0; i < normSamples.length; i++) {
                sum += moreSamples[i] * moreSamples[i];
            }
            let volume = Math.sqrt(sum / moreSamples.length);
            return volume;
        }
    }
    let fftSize = 256;
    const microphone = new Microphone(fftSize);
    let bars = [];
    const createBars = () => {
        for (let i = 0; i < (fftSize / 2); i++) {
            bars.push(new Bar(500, 300, 0.5, 500, "#ffaafa", i))
        }
    }
    createBars();
    console.log(bars);
    const animate = () => {
        if (microphone.initialized === true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            //console.log(samples);
            bars.forEach((bar, i) => {
                bar.update(samples[i]);
                bar.draw(ctx, 1);
            })
        }
        requestAnimationFrame(animate);
    }
    animate();
})