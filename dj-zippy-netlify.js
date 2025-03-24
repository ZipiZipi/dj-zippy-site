// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DJ Zippy | Professional DJ</title>
  <meta name="description" content="DJ Zippy - Professional DJ with experience spanning 60+ gigs across 32 venues">
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" href="favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;400;600&family=Roboto:wght@300;400;700&display=swap">
</head>
<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>

// netlify.toml
[build]
  publish = "public"
  command = "npm run build"

[dev]
  command = "npm run start"
  port = 8888
  targetPort = 3000
  publish = "public"
  autoLaunch = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

// package.json
{
  "name": "dj-zippy",
  "version": "1.0.0",
  "description": "DJ Zippy's professional website",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
