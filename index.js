const Video = require('./app/process/video');

/* In order to successfully merge, there should be different instances of Video that would
    first edit each video as desired by the user.
    The path of each edit video should be stored
    Then a final instance of Video will be create to merge all clips together, process that
    and output to a final destination.
*/
function mergeAllClips() {
    console.log('Merging all clips');
    let video = new Video('./app/resources/video.mp4', './merged.mp4');
    video.merge(['./output1.mp4']);
}

console.log('Processing a video');
let video = new Video('./app/resources/video.mp4', './output1.mp4');
video.getMetadata();

video.trim(15, 25);
video.process(mergeAllClips);
