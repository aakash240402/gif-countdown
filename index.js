const express = require("express");
const GIFEncoder = require("gifencoder");
const { createCanvas } = require("canvas");
const moment = require("moment");

const app = express();

app.get("/countdown.gif", (req, res) => {
  const endTime = req.query.end; // YYYY-MM-DDTHH:mm:ss
  if (!endTime) return res.status(400).send("end param required");

  const width = 300;
  const height = 80;
  const frames = 60; // 60 seconds animation

  res.setHeader("Content-Type", "image/gif");

  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(res);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000);
  encoder.setQuality(10);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.font = "32px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let now = moment();

  for (let i = 0; i < frames; i++) {
    const diff = moment(endTime).diff(now);

    let d = moment.duration(diff);

    let timeString =
      String(Math.max(0, Math.floor(d.asDays()))).padStart(2, "0") + ":" +
      String(Math.max(0, d.hours())).padStart(2, "0") + ":" +
      String(Math.max(0, d.minutes())).padStart(2, "0") + ":" +
      String(Math.max(0, d.seconds())).padStart(2, "0");

    // background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // timer text
    ctx.fillStyle = "#ffffff";
    ctx.fillText(timeString, width / 2, height / 2);

    encoder.addFrame(ctx);

    now.add(1, "second");
  }

  encoder.finish();
});

app.listen(3000, () => {
  console.log("Countdown GIF running on http://localhost:3000");
});
