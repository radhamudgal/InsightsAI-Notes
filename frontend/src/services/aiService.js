import api from './api';

export const generateSummary = (content, noteId) =>
  api.post('/ai/summary', { content, noteId }).then((r) => r.data.summary);

export const extractActionItems = (content, noteId) =>
  api.post('/ai/action-items', { content, noteId }).then((r) => r.data.actionItems);

export const suggestTitle = (content) =>
  api.post('/ai/title', { content }).then((r) => r.data.title);
