# XHS embedder

## Introduction
Embed posts from Xiaohongshu/Rednote directly in Discord

## Features
- Embed Xiaohongshu videos in Discord messages
- Uses Cloudflare Workers free plan for easy deployment

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/hono-xiaohongshu-discord
    ```
2. Navigate to the project directory:
    ```sh
    cd hono-xiaohongshu-discord
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage
1. Start the app locally:
    ```sh
    npm run dev
    ```
2. Deploy the app:
    ```
    npm run deploy
    ```

## Tutorial
1. replace `xhslink.com` with the url of the deployed embedder instance

    eg: http://xhslink.com/a/Y7qA55vwYXb4 => https://xhs.main-server.workers.dev/a/Y7qA55vwYXb4