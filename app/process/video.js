const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

class Video {
    
    constructor(path, outputPath) {
        this.path = path;
        this.outputPath = outputPath;

        ffmpeg.setFfmpegPath(ffmpegPath);
        ffmpeg.setFfprobePath(ffprobeStatic.path);

        this.command = ffmpeg({ source: this.path });
        
    }

    trim(startTime, endTime) {
        this.command.setStartTime(startTime)
                    .setDuration(endTime - startTime);
    }

    merge(additionalVideos) {
        if (additionalVideos.length < 1) return;

        // Merge with the remaining videos if available
        for (let i = 0; i < additionalVideos.length; i++) {
            this.command.input(additionalVideos[i]);
        }

        this.command
            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function () {
                console.log('Merging finished!');
            })
            .mergeToFile(this.outputPath, './');
    }

    process(callback) {
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

                if (callback) callback();
            })
            .saveToFile(this.outputPath);


    }

    processCodecData(data) {
        console.log('Input is ' + data.audio + ' audio with ' + data.video + ' video');
    }

    processProgress(progress) {

    }

    getMetadata() {
        ffmpeg.ffprobe(this.path, (err, metadata) => {
            const videoStream = metadata.streams[0];
            const audioStream = metadata.streams[1];

            console.log(videoStream.duration);
        });
    }
}

module.exports = Video;