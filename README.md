# Watermark Image API with Next.js and Sharp

## Overview

This project demonstrates how to create a custom API endpoint in a Next.js application to add watermarks to images using the Sharp image processing library. The project features an API route that processes an image by adding text-based watermarks and a React component for fetching and displaying the watermarked image.

## Features

- **Custom API Endpoint:** Built using Next.js API routes to handle image processing.
- **Watermarking with Sharp:** Applies text-based watermarks with high performance and quality.
- **Client-Side Integration:** A React component fetches and displays the watermarked image.

## How It Works

### API Endpoint

- **Path:** `/api/watermark`
- **Method:** `GET`
- **Parameters:**
  - `imageUrl`: Path to the image file (relative to the `public` directory).
  - `watermarkText`: Text to be used as the watermark.

**Functionality:**
1. **Retrieve Parameters:** Parses the `imageUrl` and `watermarkText` from the request query parameters.
2. **Load Image:** Reads the image file from the `public` directory.
3. **Apply Watermark:** Uses Sharp to overlay the watermark text on the image.
4. **Respond with Image:** Returns the watermarked image as a JPEG file.

### React Component

- **File:** `page.js`
- **Function:** Fetches and displays the watermarked image.

**Functionality:**
1. **Fetch Watermarked Image:** Uses the `fetch` API to call the `/api/watermark` endpoint with the sample image and watermark text.
2. **Display Image:** Updates the component state with the URL of the fetched image and renders it using the Next.js `Image` component.

## Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git


Navigate to the Project Directory, Install Dependencies, Start the Development Server, Open your browser and navigate to http://localhost:3000. You should see the watermarked image displayed.