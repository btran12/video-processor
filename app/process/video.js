const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

class Video {
    
    constructor(path) {
        this.path = path;
        this.defaultFileName = './output.mp4';

        ffmpeg.setFfmpegPath(ffmpegPath);

        this.command = ffmpeg({ source: this.path });
        
    }

    trim(startTime, endTime) {
        this.command.setStartTime(startTime)
                    .setDuration(endTime - startTime);
    }

    process() {
        const startTime = Date.now();
        this.command
            .on('start', (commandLine) => {
                console.log('Spawned FFmpeg with command: ' + commandLine);
            })
            .on('codecData', this.processCodecData)
            .on('progress', this.processProgress)
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', () => {
                const seconds = (Date.now() - startTime) / 1000;
                console.log(`Processing finished! (${seconds}s)`);
            })
            .saveToFile(this.defaultFileName);
    }

    processCodecData(data) {
        console.log('Input is ' + data.audio + ' audio with ' + data.video + ' video');
    }

    processProgress(progress) {

    }

    getMetadata() {
        ffprobe(this.path, { path: ffprobeStatic.path })
            .then((info) => {
                const videoStream = info.streams[0];
                const audioStream = info.streams[1];

                console.log(videoStream.duration);
            })
            .catch((err) => {
                console.error(err);
            });
        
    }
}

module.exports = Video;