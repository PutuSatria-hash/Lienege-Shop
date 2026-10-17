// Vercel Serverless Function: Cloud Relay State for Pixel Lineage Orders & Live Chat
const CLOUD_STATE_ID = 'ff808181a09d98f701a14ab3f8790390';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_STATE_ID}`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(CLOUD_API_URL);
      if (!response.ok) {
        return res.status(200).json({ orders: [], chats: {}, reviews: [] });
      }
      const json = await response.json();
      return res.status(200).json(json.data || { orders: [], chats: {}, reviews: [] });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }
      const { action, payload } = body || {};

      // 1. Fetch current cloud state
      let currentState = { orders: [], chats: {}, reviews: [] };
      try {
        const fetchCur = await fetch(CLOUD_API_URL);
        if (fetchCur.ok) {
          const curJson = await fetchCur.json();
          if (curJson.data) currentState = curJson.data;
        }
      } catch (err) {
        // Fallback to empty
      }

      if (!Array.isArray(currentState.orders)) currentState.orders = [];
      if (!currentState.chats || typeof currentState.chats !== 'object') currentState.chats = {};
      if (!Array.isArray(currentState.reviews)) currentState.reviews = [];

      // 2. Execute Action
      if (action === 'create_order' && payload) {
        const exists = currentState.orders.some(o => o.id === payload.id);
        if (!exists) {
          currentState.orders.unshift(payload);
        }
      } else if (action === 'complete_order' && payload) {
        const { orderId } = payload;
        currentState.orders = currentState.orders.map(o =>
          o.id === orderId ? { ...o, status: 'Completed', completedAt: new Date().toISOString() } : o
        );
      } else if (action === 'update_status' && payload) {
        const { orderId, status } = payload;
        currentState.orders = currentState.orders.map(o =>
          o.id === orderId ? { ...o, status } : o
        );
      } else if (action === 'send_chat' && payload) {
        const { orderId, message } = payload;
        if (!currentState.chats[orderId]) currentState.chats[orderId] = [];
        const exists = currentState.chats[orderId].some(m => m.id === message.id);
        if (!exists) {
          currentState.chats[orderId].push(message);
        }
      } else if (action === 'create_review' && payload) {
        const exists = currentState.reviews.some(r => r.id === payload.id);
        if (!exists) {
          currentState.reviews.unshift(payload);
        }
      }

      // 3. Save updated state back to cloud
      await fetch(CLOUD_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'wiseman_shop_state',
          data: currentState
        })
      });

      return res.status(200).json({ success: true, data: currentState });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
