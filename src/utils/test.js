const exec = require('child_process').exec;

export function start () {
    exec('node -v', function(error, stdout, stderr) {
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
        if (error !== null) {
          console.log('exec error: ', error);
        }
    });
}