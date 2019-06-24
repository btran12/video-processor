const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

class Video {
    
    constructor(path) {
        this.path = path;
        ffmpeg.setFfmpegPath(ffmpegPath);
        
    }

    process() {
        const startTime = Date.now();
        const command = ffmpeg({ source: this.path })
            .withNoAudio()
            .setStartTime(15)
            .setDuration(5)
            .on('start', function(commandLine) {
                // The 'start' event is emitted just after the FFmpeg
                // process is spawned.
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
            .saveToFile('./output.mp4');
    }

    // The 'codecData' event is emitted when FFmpeg first
    // reports input codec information. 'data' contains
    // the following information:
    // - 'format': input format
    // - 'duration': input duration
    // - 'audio': audio codec
    // - 'audio_details': audio encoding details
    // - 'video': video codec
    // - 'video_details': video encoding details
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