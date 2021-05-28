const sass = require('sass');
const fs = require('fs');
const path = require('path');

function transferSass() {
  sass.render(
    {
      file: path.resolve(__dirname, '../src/index.scss'),
      outputStyle: 'compressed'
    },
    function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      const cssSource = result.css.toString();
      fs.writeFile(
        path.resolve(__dirname, '../src/style.js'),
        "export default '" + cssSource.replace(/\n/g, '') + "'",
        function(err) {
          if (err) {
            console.error(err);
          }
          console.log('css file has been transformed to JS successful');
          fs.writeFile(
            path.resolve(__dirname, '../src/style.css'),
            cssSource,
            function(err) {
              if (err) {
                console.error(err);
              }
              console.log('css file has been transformed successful');
              process.exit();
            }
          );
        }
      );
    }
  );
}

transferSass();

fs.watch(path.resolve(__dirname, '../src/index.scss'), function(
  event,
  filename
) {
  console.log(event, filename);
  transferSass();
});
