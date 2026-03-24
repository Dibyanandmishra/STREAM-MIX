API SPECIFICATION:

Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token

User
GET /api/users/profile
PUT /api/users/update
GET /api/users/history

Video
POST /api/videos/upload
GET /api/videos
GET /api/videos/:id
PUT /api/videos/:id
DELETE /api/videos/:id
PATCH /api/videos/:id/publish

Comments
POST /api/comments
GET /api/comments/:videoId
PUT /api/comments/:id
DELETE /api/comments/:id

Likes
POST /api/likes/video/:id
POST /api/likes/comment/:id
GET /api/likes/videos

Playlist
POST /api/playlists
GET /api/playlists
PUT /api/playlists/:id
DELETE /api/playlists/:id

Subscriptions
POST /api/subscriptions/:channelId
GET /api/subscriptions
GET /api/subscribers