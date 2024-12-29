const mongoose = require("mongoose");

const ScheduledVideoSchema = new mongoose.Schema({
  scheduleTime: { type: Date, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
        platform: {Type: String , enum : ["Linkedin","Twitter"]},
  failureReason: { type: String },
});

const ScheduleVideo = mongoose.model("ScheduleVideo", ScheduledVideoSchema);
module.exports = ScheduleVideo;
