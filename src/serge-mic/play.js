const player = require("play-sound")();

const play = (sounds) => {
  let functions = [];
  for (let i = 0; i < sounds.length; i++) {
    functions[i] = () => player.play(sounds[sounds.length - i - 1], functions[i - 1] || (() => {}));
  }

  functions[functions.length - 1]();
}

module.exports = {
  play
};
