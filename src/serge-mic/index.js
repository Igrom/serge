const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const { SergeManagerClient } = require('serge-manager-client');
const { play } = require("./play");

const speechClient = new speech.SpeechClient();
const managerClient = new SergeManagerClient("http://localhost:4007");

let id = null;

managerClient.addEmployee()
  .then(employee => {
    id = employee._links.self.href.split("/")[employee._links.self.href.split("/").length - 1];
    console.log(id);
  });

const main = async () => {
  const stream = speechClient.streamingRecognize({
    config: {
      encoding: 'LINEAR16',
      languageCode: 'en-us',
      sampleRateHertz: 16000,
    },
    single_utterance: true
  })
    .on('error', function() {
      record.stop();
      main();
    })
    .on('data', async function(response) {
    let transcript = response && response.results && response.results[0] && response.results[0].alternatives && response.results[0].alternatives[0] && response.results[0].alternatives[0].transcript;

    let numbers = [
      ['zero', '0'],
      ['one', '1'],
      ['two', '2'],
      ['three', '3'],
      ['four', '4'],
      ['five', '5'],
      ['six', '6'],
      ['seven', '7'],
      ['eight', '8'],
      ['nine', '9']
    ];

    numbers.map(pair => { transcript = transcript.replace(new RegExp(pair[0], 'g'), pair[1])});
    transcript = transcript.replace(/[- :]/g, "").toLowerCase();

    console.log(transcript);

    let reply = await managerClient.postAction(id, transcript);
    console.log(`\t${reply.text}`);
    let withSplitNumbers = reply.text.toLowerCase().replace(/\d+/, match => match.split('').join(' '));
    let sounds = withSplitNumbers.split(' ').map(s => `./sounds/new/${s}.mp3`);
    play(sounds);
  });

  record
      .start({
          sampleRateHertz: 16000,
          threshold: 0,
          verbose: false,
          recordProgram: 'rec',
          silence: '1.0'
      })
      .on('error', console.error)
      .pipe(stream);
};

main();
