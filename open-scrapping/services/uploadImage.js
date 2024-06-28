const axios = require("axios");
const FormData = require("form-data");

/**
 * Uploads an image to Imgur and returns the image URL.
 *
 * @param {string} screenShot - The base64 encoded image string.
 * @param {string} title - The title for the image.
 * @param {string} description - The description for the image.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
async function uploadImage(screenShot, title, description) {
  const formData = new FormData();
  formData.append("image", screenShot);
  formData.append("type", "base64");
  formData.append("title", title);
  formData.append("description", description);

  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMAGER_CLIENT_ID}`,
          ...formData.getHeaders(),
        },
      }
    );
    return response.data.data.link;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message
    );
    return "";
  }
}

module.exports = { uploadImage };
