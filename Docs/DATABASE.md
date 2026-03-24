DATABASE SCHEMA DOCUMENT:

User:
name: String
email: String
password: String
avatar: String
coverImage: String
subscribers: [ObjectId]
subscriptions: [ObjectId]
watchHistory: [ObjectId]

Video:
title: String
description: String
videoUrl: String
thumbnail: String
owner: ObjectId
views: Number
isPublished: Boolean
likes: Number

Comment:
content: String
video: ObjectId
owner: ObjectId
likes: Number

Playlist:
name: String
owner: ObjectId
videos: [ObjectId]

Like:
user: ObjectId
video/comment: ObjectId