const Video = require('./app/process/video');

const video = new Video('./app/resources/video.mp4');

// video.getMetadata();
video.process();