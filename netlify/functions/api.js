const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '..', '..', 'db.json');

function loadSeedData() {
  const raw = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(raw);
}

let runtimeDb = loadSeedData();

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function extractPath(eventPath) {
  const withoutFunctionPrefix = eventPath
    .replace(/^\/.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');
  return withoutFunctionPrefix || '/';
}

function nextId() {
  return Math.random().toString(16).slice(2, 6);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  const requestPath = extractPath(event.path || '/');
  const [_, resource, id] = requestPath.split('/');

  if (!['users', 'products', undefined].includes(resource)) {
    return json(404, { message: 'Not found' });
  }

  if (!resource) {
    return json(200, {
      message: 'Inventory API is running on Netlify Functions',
      endpoints: ['/api/users', '/api/products'],
    });
  }

  if (!Array.isArray(runtimeDb[resource])) {
    runtimeDb[resource] = [];
  }

  const collection = runtimeDb[resource];

  if (event.httpMethod === 'GET' && !id) {
    return json(200, collection);
  }

  if (event.httpMethod === 'GET' && id) {
    const item = collection.find((entry) => String(entry.id) === String(id));
    return item ? json(200, item) : json(404, { message: 'Not found' });
  }

  if (event.httpMethod === 'POST' && !id) {
    const payload = event.body ? JSON.parse(event.body) : {};
    const created = { ...payload, id: payload.id || nextId() };
    collection.push(created);
    return json(201, created);
  }

  if (event.httpMethod === 'PUT' && id) {
    const index = collection.findIndex((entry) => String(entry.id) === String(id));
    if (index === -1) {
      return json(404, { message: 'Not found' });
    }

    const payload = event.body ? JSON.parse(event.body) : {};
    const updated = { ...collection[index], ...payload, id: String(id) };
    collection[index] = updated;
    return json(200, updated);
  }

  if (event.httpMethod === 'DELETE' && id) {
    const index = collection.findIndex((entry) => String(entry.id) === String(id));
    if (index === -1) {
      return json(404, { message: 'Not found' });
    }

    collection.splice(index, 1);
    return json(204, {});
  }

  return json(405, { message: 'Method not allowed' });
};
