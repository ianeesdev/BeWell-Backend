const express = require('express');
const asyncHandler = require('express-async-handler');
const Video = require('../models/videoModel');

// @desc    Add a new video
// @route   POST /videos/add
// @access  Public
const addVideo = asyncHandler(async (req, res) => {
  const { source } = req.body;

  const video = await Video.create({ source });

  res.status(201).json({ data: video });
});

// @desc    Delete a video
// @route   DELETE /videos/delete/:id
// @access  Public
const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findByIdAndDelete(id);

  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  res.status(200).json({ data: video });
});

// @desc    Get all videos
// @route   GET /videos/getAll
// @access  Public
const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find();

  res.status(200).json({ data: videos });
});


module.exports = {
    addVideo,
    deleteVideo,
    getAllVideos
  };


