//
//  figmaintegration.js
//  vie dashboard forecast
//
//  Created by Jake Bass on 3/31/25.
//


// src/services/figmaIntegration.js
// This module integrates with the Figma API to fetch design data from the "new dashbard" frame.
import axios from 'axios';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_FILE_KEY = 'GfPnIthTdpq9jRjuk5lMwP'; // Extracted from your Figma link
const FIGMA_FRAME_NAME = 'new dashbard';
const FIGMA_API_KEY = 'figd_DUY6IsMOek2Rq-xZ2g8S9VlsMP5HokdYvpzCGHXy';

export async function fetchFigmaDesign() {
  try {
    const response = await axios.get(`${FIGMA_API_URL}/files/${FIGMA_FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_API_KEY
      }
    });
    // Here, you can process the Figma design to extract tokens, components, etc.
    // For now, we return the raw data.
    return response.data;
  } catch (error) {
    console.error('Error fetching Figma design:', error);
    throw error;
  }
}